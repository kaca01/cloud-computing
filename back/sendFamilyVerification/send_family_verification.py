import boto3
import json
import os
import base64
ses = boto3.client("ses")

from utility.utils import create_response

s3 = boto3.client('s3')
topic = os.environ.get('VERIFY_FAMILY_TOPIC')
sns = boto3.client('sns')

def lambda_handler(event, context):

    user = event['user']
    invitedEmail = event['invitedEmail']
    sender = "anastasijas557@gmail.com"

    ses.send_email(
        Source=sender,
        Destination={"ToAddresses": [invitedEmail]},
        Message={
            "Subject": { "Data": 'Confirm family member' },
            "Body": { "Text": { "Data": f"Your family memeber {user['email']} accepted your invitation. You have to confirm it was you who sent them invitation to the Galerry App by going to the provided link. They will have access to your root folder. You can change this later in the app. Here is the Link: http://localhost:4200/activation/{user['email']}"} },
        },
    )

    data = {
            "user" : user,
            "invitedEmail": invitedEmail
        }
    return create_response(200, data)