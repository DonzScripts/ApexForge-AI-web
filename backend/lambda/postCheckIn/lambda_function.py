import json
import os
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
checkins_table = dynamodb.Table(os.environ["CHECKINS_TABLE"])


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

        check_in_date = body.get("checkInDate")
        if not check_in_date:
            return response(400, {"error": "checkInDate is required"})

        item = {
            "userId": user_id,
            "checkInDate": check_in_date,
            "weight": body.get("weight"),
            "steps": body.get("steps"),
            "mood": body.get("mood"),
            "notes": body.get("notes", "")
        }

        checkins_table.put_item(Item=item)

        return response(200, {
            "success": True,
            "item": item
        })

    except ClientError as e:
        return response(500, {"error": str(e)})
    except Exception as e:
        return response(500, {"error": str(e)})