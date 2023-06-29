import boto3
import json
import os
import base64
from botocore.exceptions import ClientError

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['SHARED_TABLE_NAME']

def lambda_handler(event, context):

    # Extract the file/folder path from the event
    document_path = event['queryStringParameters']['document_path']
    table = dynamodb.Table(table_name)

    # get item from table
    response = table.get_item(Key={'documentName':document_path})

    if 'Item' in response:
        # Item found
        body = {
            'data': response['Item']
        }
        return create_response(200, body)
    else:
        body = {
            'data': []
        }
        return create_response(200, body)