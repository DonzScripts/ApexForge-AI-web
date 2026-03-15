import json
import os
from datetime import datetime, timezone
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ["USERS_TABLE"])


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
        email = claims.get("email", "")

        if not user_id:
            return response(401, {"error": "Unauthorized"})

        result = users_table.get_item(Key={"userId": user_id})
        item = result.get("Item")

        if item:
            return response(200, item)

        new_user = {
            "userId": user_id,
            "email": email,
            "createdAt": datetime.now(timezone.utc).isoformat()
        }

        users_table.put_item(Item=new_user)

        return response(200, new_user)

    except ClientError as e:
        return response(500, {"error": str(e)})
    except Exception as e:
        return response(500, {"error": str(e)})