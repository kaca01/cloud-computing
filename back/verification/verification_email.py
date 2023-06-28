import boto3
import json

from utility.utils import create_response

ses = boto3.client("ses")

def lambda_handler(event, context):
    body = json.loads(event['body'])

    ses.verify_email_identity(
        EmailAddress=body['email']
    )

    body = {
        'message': 'Successfuly registered! To receive notifications, check your email'
    }
    return create_response(200, body)