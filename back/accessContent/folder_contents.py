import boto3
from utility.utils import create_response
from urllib.parse import unquote
import os

s3 = boto3.resource('s3')
bucket_name = os.environ['BUCKET_NAME']


def lambda_handler(event, context):
    path = event['pathParameters']['name']
    folder_name = unquote(path)

    # TODO : delete the following line later
    folder_name = "folderrr/folder2"
    bucket = s3.Bucket(bucket_name)

    contents = []

    objects = bucket.objects.filter(Prefix=folder_name)
    for obj in objects:
        contents.append(obj.key)

    body = {
        'data': contents
    }

    return create_response(200, body)
