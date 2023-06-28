import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']

def lambda_handler(event, context):

    # Extract the file/folder path from the event
    file_path = event['queryStringParameters']['file_path']

    # Delete the file
    s3.delete_object(Bucket=bucket_name, Key=file_path)
    # also delete data from dynamodb
    table = dynamodb.Table(table_name)
    table.delete_item(
         Key = {'fileName' : file_path}
    )
    #todo delete user permisions?

    body = {
        'message': event
    }
    return create_response(200, body)
