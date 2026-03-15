import json
import os
import uuid
from datetime import datetime, timezone
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
plans_table = dynamodb.Table(os.environ["PLANS_TABLE"])


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }


def lambda_handler(event, context):
    try:
        claims = event.get("requestContext", {}).get("authorizer", {}).get("jwt", {}).get("claims", {})
        user_id = claims.get("sub")

        if not user_id:
            return response(401, {"error": "Unauthorized"})

        body = json.loads(event.get("body") or "{}")

        title = body.get("title")
        if not title:
            return response(400, {"error": "title is required"})

        item = {
            "userId": user_id,
            "planId": str(uuid.uuid4()),
            "title": title,
            "goal": body.get("goal", ""),
            "createdAt": datetime.now(timezone.utc).isoformat()
        }

        plans_table.put_item(Item=item)

        return response(200, item)

    except ClientError as e:
        return response(500, {"error": str(e)})
    except Exception as e:
        return response(500, {"error": str(e)})