import boto3
import os
from utility.utils import create_response
from urllib.parse import unquote

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

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
