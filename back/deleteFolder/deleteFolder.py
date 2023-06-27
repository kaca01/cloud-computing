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
    folder_path = event['queryStringParameters']['folder_path']

    
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=folder_path)

    # Delete files
    if 'Contents' in response:
        objects = [{'Key': obj['Key']} for obj in response['Contents']]
        s3.delete_objects(Bucket=bucket_name, Delete={'Objects': objects})
        #todo test this
        # also delete all data from dynamo
        # for obj in objects:
        #     dynamodb.delete_item(
        #         TableName=table_name,
        #         Key=obj['Key']
        #     )

    #todo delete user permisions?

    # Delete the folder
    s3.delete_object(Bucket=bucket_name, Key=folder_path)

    body = {
        'message': event
    }
    return create_response(200, body)
