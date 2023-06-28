import boto3
import json

ses_client = boto3.client("ses")

def handler(event, context):
    body = json.loads(event["Records"][0]["Sns"]["Message"])

    sender = "anastasijas557@gmail.com"
    recipient = body['recipient']
    ses_client.send_email(
        Source=sender,
        Destination={"ToAddresses": [recipient]},
        Message={
            "Subject": { "Data": body["subject"] },
            "Body": { "Text": { "Data": body["content"] } },
        },
    )