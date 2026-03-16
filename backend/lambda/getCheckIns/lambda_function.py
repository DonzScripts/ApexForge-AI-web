import json
import os
import boto3
from boto3.dynamodb.conditions import Key
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
        claims = (
            event.get("requestContext", {})
            .get("authorizer", {})
            .get("jwt", {})
            .get("claims", {})
        )
        user_id = claims.get("sub")

        if not user_id:
            return response(401, {"error": "Unauthorized"})

        result = checkins_table.query(
            KeyConditionExpression=Key("userId").eq(user_id),
            ScanIndexForward=False
        )

        return response(200, {
            "success": True,
            "items": result.get("Items", [])
        })

    except ClientError as e:
        return response(500, {"error": str(e)})
    except Exception as e:
        return response(500, {"error": str(e)})

