import base64
import boto3 
import os

from utility.utils import create_response

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.client('s3')

def lambda_handler(event, contex):
    file_path = event['queryStringParameters']['path']

    # response = s3.get_object(Bucket=bucket_name, Key=file_path)
    file_body = base64.b64encode(
        s3.get_object(
            Bucket=bucket_name,
            Key=file_path,
        ).get("Body")
        .read()
    ).decode("utf-8")

    # Create response
    body = {
        'message': 'Successfully download file',
        'body': file_body
    }
    return create_response(200, body)

