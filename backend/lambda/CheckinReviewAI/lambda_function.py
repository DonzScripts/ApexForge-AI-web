import os
import json
import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

REGION = os.environ.get("AWS_REGION", "us-east-1")
MODEL_ID = os.environ["BEDROCK_TEXT_MODEL_ID"]
CHECKINS_TABLE = os.environ["CHECKINS_TABLE"]

bedrock = boto3.client("bedrock-runtime", region_name=REGION)
dynamodb = boto3.resource("dynamodb", region_name=REGION)
table = dynamodb.Table(CHECKINS_TABLE)


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps(body)
    }


def get_user_sub(event):
    try:
        return event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    except KeyError:
        return None


def require_string(data, field, max_len=None):
    value = data.get(field)
    if value is None:
        raise ValueError(f"{field} is required")
    if not isinstance(value, str):
        raise ValueError(f"{field} must be a string")
    value = value.strip()
    if not value:
        raise ValueError(f"{field} cannot be empty")
    if max_len and len(value) > max_len:
        raise ValueError(f"{field} is too long")
    return value


def optional_string(data, field, max_len=None, default=""):
    value = data.get(field, default)
    if value is None:
        return default
    if not isinstance(value, str):
        raise ValueError(f"{field} must be a string")
    value = value.strip()
    if max_len and len(value) > max_len:
        raise ValueError(f"{field} is too long")
    return value


def optional_number(data, field):
    value = data.get(field)
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return value
    raise ValueError(f"{field} must be a number")


def parse_model_json(text):
    text = text.strip()

    if text.startswith("```"):
        lines = text.splitlines()
        if len(lines) >= 3:
            text = "\n".join(lines[1:-1]).strip()

    return json.loads(text)


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method")
    if method == "OPTIONS":
        return response(200, {"ok": True})

    user_sub = get_user_sub(event)
    if not user_sub:
        return response(401, {"success": False, "message": "Unauthorized"})

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return response(400, {"success": False, "message": "Invalid JSON body"})

    try:
        checkin_date = require_string(body, "checkInDate", max_len=40)
        mood = optional_string(body, "mood", max_len=50, default="")
        notes = optional_string(body, "notes", max_len=1000, default="")
        weight = optional_number(body, "weight")
        steps = optional_number(body, "steps")
    except ValueError as e:
        return response(400, {"success": False, "message": str(e)})

    system_prompt = (
        "You are a concise fitness accountability coach. "
        "Return only valid JSON. "
        "Be practical, honest, encouraging, and specific. "
        "Do not provide medical diagnosis or treatment. "
        "Keep recommendations realistic and actionable."
    )

    user_prompt = f"""
Review this user check-in and return JSON only.

User data:
- checkInDate: {checkin_date}
- weight: {weight}
- steps: {steps}
- mood: {mood}
- notes: {notes}

Return exactly this JSON shape:
{{
  "summary": "short 1-2 sentence summary",
  "recommendation": "single most important next action",
  "tomorrowFocus": "very short focus for tomorrow",
  "riskFlags": ["optional short flag", "optional short flag"]
}}
"""

    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        "max_tokens": 500,
        "temperature": 0.4
    }

    try:
        model_response = bedrock.invoke_model(
            modelId=MODEL_ID,
            body=json.dumps(request_body),
            contentType="application/json",
            accept="application/json"
        )

        response_body = json.loads(model_response["body"].read())
        content = response_body.get("content", [])

        text_parts = [item["text"] for item in content if item.get("type") == "text"]
        model_text = "\n".join(text_parts).strip()

        parsed = parse_model_json(model_text)

        summary = parsed.get("summary", "")
        recommendation = parsed.get("recommendation", "")
        tomorrow_focus = parsed.get("tomorrowFocus", "")
        risk_flags = parsed.get("riskFlags", [])

        table.update_item(
            Key={
                "userId": user_sub,
                "checkInDate": checkin_date
            },
            UpdateExpression="""
                SET mood = :m,
                    notes = :n,
                    weight = :w,
                    steps = :s,
                    aiSummary = :summary,
                    aiRecommendation = :recommendation,
                    aiTomorrowFocus = :focus,
                    aiRiskFlags = :flags,
                    updatedAt = :updatedAt
            """,
            ExpressionAttributeValues={
                ":m": mood,
                ":n": notes,
                ":w": Decimal(str(weight)) if weight is not None else Decimal("0"),
                ":s": Decimal(str(steps)) if steps is not None else Decimal("0"),
                ":summary": summary,
                ":recommendation": recommendation,
                ":focus": tomorrow_focus,
                ":flags": risk_flags,
                ":updatedAt": checkin_date
            }
        )

        return response(200, {
            "success": True,
            "checkInDate": checkin_date,
            "summary": summary,
            "recommendation": recommendation,
            "tomorrowFocus": tomorrow_focus,
            "riskFlags": risk_flags
        })

    except ClientError as e:
        return response(500, {
            "success": False,
            "message": "AWS service error",
            "error": str(e)
        })
    except json.JSONDecodeError:
        return response(500, {
            "success": False,
            "message": "Model returned non-JSON output",
            "rawOutput": model_text if "model_text" in locals() else ""
        })
    except Exception as e:
        return response(500, {
            "success": False,
            "message": "Unexpected server error",
            "error": str(e)
        })