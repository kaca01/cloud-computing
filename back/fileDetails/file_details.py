import boto3
from utility.utils import create_response
from urllib.parse import unquote


dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')
# TODO : change this before merge
table = dynamodb.Table('serverlessfiletable')


def lambda_handler(event, context):
    path = event['pathParameters']['name']
    print(path)
    file_name = unquote(path)
    print(file_name)
    response = table.get_item(
        Key={
            'fileName': file_name
        }
    )

    # file_name = response['Item']['tags']
    #
    # print(file_name)
    print(response)

    return create_response(200, response['Item'])
