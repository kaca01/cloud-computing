import boto3
import json
import os
import base64
ses = boto3.client("ses")

from utility.utils import create_response

s3 = boto3.client('s3')
sns = boto3.client('sns')

def lambda_handler(event, context):

    body = json.loads(event['body'])

    email = body['email']
    invitedEmail = body['invitedEmail']
    sender = "anastasijas557@gmail.com"

    ses.send_email(
        Source=sender,
        Destination={"ToAddresses": [email]},
        Message={
            "Subject": { "Data": 'Invitation to Gallery App' },
            "Body": { "Text": { "Data": f"Your family memeber {invitedEmail} has invited you to join Gallery App. To create your account fill the form from the following link: http://localhost:4200/family-registration"} },
        },
    )

    data = {
            "user" : email,
            "invitedEmail": invitedEmail
        }
    return create_response(200, data)