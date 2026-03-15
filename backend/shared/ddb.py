import boto3

dynamodb = boto3.resource("dynamodb")

def get_table(name):
    return dynamodb.Table(name)
