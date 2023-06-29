import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = os.environ['USERS_TABLE_NAME']

def lambda_handler(event, context):
    user = event['user']
    invitedEmail = event['invitedEmail']

    table = dynamodb.Table(table_name)
    table.put_item(Item={'email':user["email"], 'invitedEmail':invitedEmail, 'password':user["password"], 'telephoneNumber': user["telephoneNumber"], 'address': user["address"], 'name': user["name"], 'surname': user["surname"]})
    
    data = {
            "user" : user,
            "invitedEmail": invitedEmail
        }
    return data