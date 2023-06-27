import boto3
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')
table = dynamodb.Table('serverlessfiletable')


def lambda_handler(event, context):
    response = table.get_item(
        Key={
            'fileName': 'serverless.pdf'
        }
    )

    file_name = response['Item']['tags']

    print(file_name)

    return create_response(200, response['Item'])
