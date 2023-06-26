import boto3
from utility.utils import create_response
from urllib.parse import unquote
import os

s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']


def lambda_handler(event, context):
    print("eventtt")
    print(event)
    print(bucket_name)

    # bucket_name = "back-dev-serverlessdeploymentbucket-nqzf4sjrq5mu"
    path = event['pathParameters']['name']
    folder_name = unquote(path)

    # TODO : delete the following line later
    folder_name = "folderrr/folder2"
    print(folder_name)

    response = s3.list_objects_v2(
        Bucket=bucket_name,
        Prefix=folder_name
    )
    contents = response['Contents']
    body = {
        # TODO : or should here be just contents
        'data': [obj['Key'] for obj in contents]
    }
    print("contents")
    print(contents)
    print("RESULTTTTT")
    print(body['data'])
    return create_response(200, body)
