import json
import boto3 
import os
import base64

from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.client('s3')

topic = os.environ.get('EDIT_TOPIC')
sns = boto3.client('sns')

ses = boto3.client("ses")

def lambda_handler(event, contex):
    body = json.loads(event['body']) 
    file_name = body['fileName']
    file_content = body['fileContent']
    new_values = { 'fileModified': body["fileModified"], 'description': body["description"], 'tags': body["tags"] }

    # Update matadata
    table = dynamodb.Table(table_name)

    update_expression = 'SET '
    expression_attribute_values = {}
    for key, value in new_values.items():
        update_expression += f'{key} = :{key}, '
        expression_attribute_values[f':{key}'] = value
    update_expression = update_expression[:-2]  
    
    table.update_item(
        Key={'fileName': file_name},  
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values
    )

    # Update content
    if file_content != '':
        base64.b64encode(s3.get_object(Bucket=bucket_name, Key=file_name,).get("Body").read()).decode("utf-8")

        decoded_data = base64.b64decode(file_content.split(',')[1].strip())
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=decoded_data)

    # Check verification email
    try:
        verification_attributes = ses.get_identity_verification_attributes(Identities=[body['user']])['VerificationAttributes']
        is_verified = verification_attributes[body['user']]['VerificationStatus'] == 'Success'

        if is_verified:
            sns.publish(
                    TopicArn=topic,
                    Message=json.dumps(
                        {
                            "subject": 'Edited file',
                            "content": f"File '{ body['fileName'].split('/')[-1] }' edited successfully by { body['user'] }.",
                            "recipient": body['user'],
                        }
                    ),
                )
            # Create response
            body = {
                'message': 'Successfully edited file. \nCheck email'
            }
            return create_response(200, body)
    except:
        # Create response
        body = {
            'message': 'Successfully edited file but you have not verified email'
        }
        return create_response(200, body)