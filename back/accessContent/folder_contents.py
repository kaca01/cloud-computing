import boto3
from utility.utils import create_response
from urllib.parse import unquote
import os

s3 = boto3.resource('s3')
bucket_name = os.environ['BUCKET_NAME']


def lambda_handler(event, context):
    path = event['pathParameters']['name']
    folder_name = unquote(path)

    bucket = s3.Bucket(bucket_name)

    contents = []

    objects = bucket.objects.filter(Prefix=folder_name)

    sorted_objects = sorted(objects, key=lambda obj: obj.last_modified, reverse=True)

    for obj in sorted_objects:
        contents.append(obj.key)

    body = {
        'data': contents
    }

    return create_response(200, body)
