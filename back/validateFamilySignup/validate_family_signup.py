import boto3
import json
import os
import base64

from utility.utils import create_response
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']

userPoolId = 'eu-central-1_0X24Fz6lx'
clientId = '72tip32rlft3qhhogtbhcfkivj'

def lambda_handler(event, context):

    user = event['user']
    invitedEmail = event['invitedEmail']

    client = boto3.client('cognito-idp', region_name='eu-central-1') 

    #check if invitedEmail exists
    try:
        response = client.admin_get_user(
            UserPoolId=userPoolId,
            Username=invitedEmail
        )
    except Exception:
        raise UserNotFoundError("The email of the user that invited you does not exist!")

    # check if user email has been already taken
    try:
        response = client.admin_get_user(
            UserPoolId=userPoolId,
            Username=user['email']
        )
        raise EmailTakenError("The email already exists! Choose another one!")
    except Exception:
        return create_response(200, event)


class UserNotFoundError(Exception):
    pass

class EmailTakenError(Exception):
    pass
