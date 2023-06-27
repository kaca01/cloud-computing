import boto3
from utility.utils import create_response
from urllib.parse import unquote
import os

s3 = boto3.resource('s3')
bucket_name = os.environ['BUCKET_NAME']


def lambda_handler(event, context):
    print("eventtt")
    print(event)
    print(bucket_name)

    # bucket_name = "back-dev-serverlessdeploymentbucket-nqzf4sjrq5mu"
    path = event['pathParameters']['name']
    folder_name = unquote(path)
    print("pathhhhh")
    print(folder_name)

    # TODO : delete the following line later
    folder_name = "folderrr/folder2"
    print(folder_name)
    bucket = s3.Bucket(bucket_name)

    contents = []

    objects = bucket.objects.filter(Prefix=folder_name)
    for obj in objects:
        contents.append(obj.key)
        print(obj)

    body = {
        'data': contents
    }

    return create_response(200, body)
