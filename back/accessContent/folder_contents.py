import boto3
from utility.utils import create_response
from urllib.parse import unquote

s3 = boto3.client('s3')


def lambda_handler(event, context):
    print("eventtt")
    print(event)
    bucket_name = "serverlessfilebucket"
    path = event['pathParameters']['name']
    folder_name = unquote(path)

    # TODO : delete the following line later
    folder_name = "folderrr/folder2"

    response = s3.list_objects_v2(
        Bucket=bucket_name,
        Prefix=folder_name
    )
    contents = response['Contents']
    body = {
        # TODO : or should here be just contents
        'data': [obj['Key'] for obj in contents]
    }
    print("RESULTTTTT")
    print(body['data'])
    return create_response(200, body)
