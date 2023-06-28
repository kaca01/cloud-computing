import boto3
import json
import os
import base64
from urllib.parse import unquote

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['SHARED_TABLE_NAME']


def lambda_handler(event, context):

    # Extract the file/folder path from the event
    email = event['queryStringParameters']['email']
    table = dynamodb.Table(table_name)

    response = table.scan()

    items = response['Items']

    filtered_items = []

    for item in items:
        if 'grantedUsers' in item:
            granted_users = item['grantedUsers']
            for user in granted_users:
                if user == email:
                    filtered_items.append(item)
    body = {
        'data': filtered_items
    }
    return create_response(200, body)
