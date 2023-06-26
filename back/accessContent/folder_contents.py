import boto3
from utility.utils import create_response

s3 = boto3.client('s3')


def get_folder_contents(bucket_name, folder_name):
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


get_folder_contents("serverlessfilebucket", "folderrr/folder2")
