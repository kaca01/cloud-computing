import boto3
import json
import os
import base64
import time
from urllib.parse import unquote
from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']

topic = os.environ.get('DELETE_TOPIC')
sns = boto3.client('sns')

ses = boto3.client("ses")

def lambda_handler(event, context):
    # Extract the file/folder path from the event
    file_path = event['queryStringParameters']['file_path']
    user = event['queryStringParameters']['user']

    table = dynamodb.Table(table_name)

    file_name = unquote(file_path)
    response = table.get_item(
        Key={'fileName': file_name })
    print('response')
    print(response)
    print(response['Item'])

    max_retries = 3
    retries = 0
    is_deleted_from_s3 = False
    while retries < max_retries:
        try:
            # Delete the file
            s3.delete_object(Bucket=bucket_name, Key=file_path)

            # this means that
            is_deleted_from_s3 = True
            
            # also delete data from dynamodb
            table.delete_item(
                Key = {'fileName' : file_path}
            )
            
            if send_email(file_path, user):
                # Create response
                body = {
                    'message': 'Successfully deleted file. \nCheck email'
                }
                return create_response(200, body)
            else:
                # Create response
                body = {
                    'message': 'Successfully deleted file but you have not verified email'
                }
                return create_response(200, body)
            
        except Exception as e:
            print(f"Error deleting item from DynamoDB: {e}")
            retries += 1
            if retries < max_retries:
                backoff_time = 2 ** retries
                print(f"Retrying after {backoff_time} seconds...")
                time.sleep(backoff_time)
            else:
                if is_deleted_from_s3:
                    table.put_item(Item=response['Item'])
                body = {
                    'message': 'Error occurred during file deleted'
                }
                return create_response(500, body)
    
def send_email(file_path, user):
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
            return True
            
    except:
        return False
         
