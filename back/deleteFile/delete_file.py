import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']

topic = os.environ.get('DELETE_TOPIC')
sns = boto3.client('sns')

ses = boto3.client("ses")

def lambda_handler(event, context):
    print(event)
    print(event['queryStringParameters']['file_path'])
    print(event['queryStringParameters']['user'])
    # Extract the file/folder path from the event
    file_path = event['queryStringParameters']['file_path']
    user = event['queryStringParameters']['user']

    # Delete the file
    s3.delete_object(Bucket=bucket_name, Key=file_path)
    # also delete data from dynamodb
    table = dynamodb.Table(table_name)
    table.delete_item(
         Key = {'fileName' : file_path}
    )
    #todo delete user permisions?
 
    # Check verification email
    try:
        verification_attributes = ses.get_identity_verification_attributes(Identities=[user])['VerificationAttributes']
        is_verified = verification_attributes[user]['VerificationStatus'] == 'Success'

        if is_verified:
            sns.publish(
                    TopicArn=topic,
                    Message=json.dumps(
                        {
                            "subject": 'Deleted file',
                            "content": f"File '{ file_path.split('/')[-1] }' deleted successfully by { user }.",
                            "recipient": user,
                        }
                    ),
                )
            # Create response
            body = {
                'message': 'Successfully deleted file. \nCheck email'
            }
            return create_response(200, body)
    except:
        # Create response
        body = {
            'message': 'Successfully deleted file but you have not verified email'
        }
        return create_response(200, body)
