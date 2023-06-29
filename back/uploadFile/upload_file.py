import boto3
import json
import os
import base64

from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.resource('s3')

sqs_name = os.environ['SQS_NAME']
sqs = boto3.client('sqs')

topic = os.environ.get('UPLOAD_TOPIC')
sns = boto3.client('sns')

ses = boto3.client("ses")

sf_client = boto3.client('stepfunctions')


def step(event, context):
    body = json.loads(event['body'])
    print(body)

    message_body = {
        'fileContent': body['fileContent'],
        'fileName': body['fileName'],
        'fileType': body['fileType'],
        'fileSize': body['fileSize'],
        'fileCreated': body['fileCreated'],
        'fileModified': body['fileModified'],
        'description': body['description'],
        'tags': body['tags'],
        'user': body['user']
    }
    
    response = sf_client.start_execution(
        stateMachineArn='arn:aws:states:eu-central-1:522114191780:stateMachine:my-step-function',
        input=json.dumps(message_body)
    )

    print(response)

def storage_file(event, context):
    print(event)
    body = event
    print(body)

    bucket = s3.Bucket(bucket_name)

    # Upload file to s3
    decoded_data = base64.b64decode(body["fileContent"].split(',')[1].strip())
    bucket.put_object(Bucket=bucket_name, Key=body["fileName"], Body=decoded_data)

    message_body = {
        'fileName': body['fileName'],
        'fileType': body['fileType'],
        'fileSize': body['fileSize'],
        'fileCreated': body['fileCreated'],
        'fileModified': body['fileModified'],
        'description': body['description'],
        'tags': body['tags']
    }
    sqs.send_message(
        QueueUrl=sqs_name,
        MessageBody=json.dumps(message_body)
    )

    # Check verification email
    try:
        print(ses.get_identity_verification_attributes(Identities=[body['user']]))
        verification_attributes = ses.get_identity_verification_attributes(Identities=[body['user']])['VerificationAttributes']
        is_verified = verification_attributes[body['user']]['VerificationStatus'] == 'Success'

        if is_verified:
            sns.publish(
                    TopicArn=topic,
                    Message=json.dumps(
                        {
                            "subject": 'Upload file',
                            "content": f"File '{ body['fileName'] }' uploaded successfully.",
                            "recipient": body['user'],
                        }
                    ),
                )
            # Create response
            body = {
                'message': 'Successfully upload file. \nCheck email'
            }
            return create_response(200, body)
    except:
        # Create response
        body = {
            'message': 'Successfully upload file but you have not verified email'
        }
        return create_response(200, body)


def storage_metadata(event, context):
    print('106')
    print(event)
    for record in event['Records']:
        message_body = json.loads(record['body'])
    
    # Put item into DynamoDB table
    table = dynamodb.Table(table_name)
    table.put_item(Item=message_body)
    
    # Create response
    body = {
        'message': 'Successfully uploaded file'
    }
    return create_response(200, body)
