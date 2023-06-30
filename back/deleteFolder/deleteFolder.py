import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']
shared_table_name = os.environ['SHARED_TABLE_NAME']

def lambda_handler(event, context):

    # Extract the file/folder path from the event
    folder_path = event['queryStringParameters']['folder_path']
    table = dynamodb.Table(table_name)
    
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_path)

    # Delete files
    if 'Contents' in response:
        objects = [{'Key': obj['Key']} for obj in response['Contents']]
        s3.delete_objects(Bucket=bucket_name, Delete={'Objects': objects})
        # also delete data from dynamo
        for obj in objects:
            table.delete_item(
                Key = {'fileName' : obj['Key']}
            )
    
    # also delete from shared table
    shared_table = dynamodb.Table(shared_table_name)
    shared_table.delete_item(
        Key = {'documentName' : folder_path}
    )

    # Delete the folder
    s3.delete_object(Bucket=bucket_name, Key=folder_path)

    body = {
        'message': event
    }
    return create_response(200, body)
