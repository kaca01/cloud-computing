import boto3
import json
import os
import base64
import zlib

from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
second_table = 'serverlessfiletableradi'
dynamodb = boto3.resource('dynamodb')

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.resource('s3') 
ss = boto3.client('s3')

sqs_name = os.environ['SQS_NAME']
sqs = boto3.client('sqs')

topic = os.environ.get('UPLOAD_TOPIC')
sns = boto3.client('sns')

ses = boto3.client("ses")

sf_client = boto3.client('stepfunctions')


def step(event, context):
    current_path = os.getcwd()
    print(current_path)
    body = json.loads(event['body'])
    print(body)
    # global fileContent
    # fileContent = body['fileContent']
    # with open('myfile/myfile.txt', 'w') as file:
    #     # Write data to the file
    #     file.write(fileContent)
    # print('11111111111111')
    # print(fileContent)
    bucket = s3.Bucket('serverlessfilebucketradi')
    obj = bucket.Object(body['fileName'])
    obj.put(Body=body['fileContent'])

    # s3.put_object(Body=body['fileContent'], Bucket='serverlessfilebucketradi', Key=body['fileName'])

    message_body = {
        'fileName': body['fileName'],
        'fileType': body['fileType'],
        'fileSize': body['fileSize'],
        'fileCreated': body['fileCreated'],
        'fileModified': body['fileModified'],
        'description': body['description'],
        'tags': body['tags'],
        'user': body['user']
    }

    # second_body = {
    #     'fileName': body['fileName'],
    #     'fileContent': body['fileContent']
    # }

    # table = dynamodb.Table(second_table)
    # table.put_item(Item=second_body)
    
    response = sf_client.start_execution(
        stateMachineArn='arn:aws:states:eu-central-1:522114191780:stateMachine:my-step-function',
        input=json.dumps(message_body)
    )


def storage_file(event, context):
    current_path = os.getcwd()
    print(current_path)
    print(event)
    body = event
    print(body)
    print("fileeeeeeee")
    # print(fileContent)

    bucket = s3.Bucket('serverlessfilebucketradi')
    obj = bucket.Object(body['fileName'])
    response = obj.get()

    fileContent = response['Body'].read().decode('utf-8')

    bucket = s3.Bucket(bucket_name)

    # fileContent = "."
    # with open('myfile/myfile.txt', 'r') as file:
    #     # Read the contents of the file
    #     fileContent = file.read()
    #     print(fileContent)

    # Upload file to s3
    # fileContent = ''
    print(fileContent)
    decoded_data = base64.b64decode(fileContent.split(',')[1].strip())
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
            # return create_response(200, body)
            return message_body
    except:
        # Create response
        body = {
            'message': 'Successfully upload file but you have not verified email'
        }
        return create_response(200, body)


def storage_metadata(event, context):

    try:
        print('106')
        print(event)
        # for record in event['Records']:
        #     message_body = json.loads(record['body'])
        # TODO : delete the following line
        # Put item into DynamoDB table
        message_body = event
        table = dynamodb.Table(table_name)
        table.put_item(Item=message_body)
    
    except Exception:
        for record in event['Records']:
            message_body = json.loads(record['body'])
            table = dynamodb.Table(table_name)
            table.put_item(Item=message_body)
        
    # Create response
    body = {
        'message': 'Successfully uploaded file'
    }
    return create_response(200, body)

