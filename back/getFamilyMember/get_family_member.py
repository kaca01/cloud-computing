import boto3
import json
import os
import base64
from urllib.parse import unquote

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['USERS_TABLE_NAME']


def lambda_handler(event, context):

    email = unquote(event['pathParameters']['email'])
    table = dynamodb.Table(table_name)

    response = table.get_item(Key={'email':email})

    body = {
        'user': response
    }
    return create_response(200, body)
