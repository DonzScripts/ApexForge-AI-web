import os
import json
import boto3
import base64

REGION = os.environ.get("AWS_REGION", "us-east-1")
MODEL_ID = os.environ["BEDROCK_MODEL_ID"]
BUCKET = os.environ["UPLOAD_BUCKET"]

bedrock = boto3.client("bedrock-runtime", region_name=REGION)
s3 = boto3.client("s3", region_name=REGION)


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


def lambda_handler(event, context):

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return response(200, {"ok": True})

    user_sub = get_user_sub(event)
    if not user_sub:
        return response(401, {"success": False})

    body = json.loads(event.get("body") or "{}")

    image_key = body.get("frontImageKey")
    notes = body.get("notes", "")
    goal = body.get("goal", "recomp")

    if not image_key:
        return response(400, {"message": "Missing image key"})

    # 🔹 Get image from S3
    s3_obj = s3.get_object(Bucket=BUCKET, Key=image_key)
    image_bytes = s3_obj["Body"].read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    print("MODEL_ID IN USE:", MODEL_ID)

    prompt = f"""
You are an elite physique coach.

Analyze the user's body and return JSON ONLY.

User goal: {goal}
Notes: {notes}

Return:
{{
  "overallAssessment": "",
  "summary": "",
  "recommendation": "",
  "trainingFocus": [],
  "improvementAreas": [],
  "strengths": [],
  "recommendedPhase": ""
}}
"""

    bedrock_response = bedrock.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 800,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_base64
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        })
    )

    result = json.loads(bedrock_response["body"].read())
    text_output = result["content"][0]["text"]

    try:
        parsed = json.loads(text_output)
    except Exception as e:
        return response(500, {
            "message": "Failed to parse AI response",
            "raw": text_output
        })

    return response(200, {
        "success": True,
        **parsed
    })