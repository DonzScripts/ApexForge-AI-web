import os
import json
import uuid
import mimetypes
import boto3

s3 = boto3.client("s3")
UPLOAD_BUCKET = os.environ["UPLOAD_BUCKET"]

ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

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
        return response(401, {"success": False, "message": "Unauthorized"})

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return response(400, {"success": False, "message": "Invalid JSON body"})

    file_name = body.get("fileName", "")
    content_type = body.get("contentType", "")
    category = body.get("category", "")

    if not file_name or not content_type or not category:
        return response(400, {
            "success": False,
            "message": "fileName, contentType, and category are required"
        })

    if content_type not in ALLOWED_CONTENT_TYPES:
        return response(400, {
            "success": False,
            "message": "Only JPEG, PNG, and WEBP images are allowed"
        })

    if category not in ["food", "physique"]:
        return response(400, {
            "success": False,
            "message": "category must be 'food' or 'physique'"
        })

    extension = ALLOWED_CONTENT_TYPES[content_type]
    unique_id = str(uuid.uuid4())

    safe_name = file_name.lower().replace(" ", "-")
    if category == "food":
        key = f"private/{user_sub}/food/{unique_id}{extension}"
    else:
        key = f"private/{user_sub}/physique/{unique_id}{extension}"

    try:
        upload_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": UPLOAD_BUCKET,
                "Key": key,
                "ContentType": content_type
            },
            ExpiresIn=900
        )

        return response(200, {
            "success": True,
            "uploadUrl": upload_url,
            "key": key
        })

    except Exception as e:
        return response(500, {
            "success": False,
            "message": "Failed to create presigned URL",
            "error": str(e)
        })