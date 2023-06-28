import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']

userPoolId = 'eu-central-1_0X24Fz6lx'
clientId = '72tip32rlft3qhhogtbhcfkivj'

def lambda_handler(event, context):

    # body = json.loads(event['body']) 

    # client = boto3.client('cognito-idp', region_name='eu-central-1') #todo change region

    # #check if invitedEmail exists
    # try:
    #     response = client.admin_initiate_auth(
    #         UserPoolId= userPoolId,
    #         ClientId= clientId,
    #         AuthFlow='ADMIN_NO_SRP_AUTH',
    #         AuthParameters={
    #             'USERNAME': body['invitedEmail']
    #         }
    #     )
    # except client.exceptions.UserNotFoundException:
    #     body = {
    #     'message': "The email of the user that invited you does not exists!"
    #     }
    #     return create_response(404, body)

    # # check if user email has been already taken
    # try:
    #     response = client.admin_initiate_auth(
    #         UserPoolId= userPoolId,
    #         ClientId= clientId,
    #         AuthFlow='ADMIN_NO_SRP_AUTH',
    #         AuthParameters={
    #             'USERNAME': body['email']
    #         }
    #     )
    # except client.exceptions.UserNotFoundException:
    #     body = {
    #     'message': "The email already exists! Choose another one!"
    #     }
    #     return create_response(400, body)

    body = {
        'message': event
    }
    return create_response(200, body)
