import boto3
import json
import os
import base64

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['SHARED_TABLE_NAME']

def lambda_handler(event, context):

    # Extract the file/folder path from the event
    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)
    #todo check if all users exist
    #todo check if user already has permission for this document (not to add him twice)
    # Put item into table
    table.put_item(Item={'documentName':body["document_path"], 'grantedUsers':body["granted_users"]})
    body = {
        'message': "Successfully changed permissions"
    }
    return create_response(200, body)