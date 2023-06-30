import json
import time
import boto3

from utility.utils import create_response

def lambda_handler(event, context):
    # Create a Boto3 client for Step Functions
    sf_client = boto3.client('stepfunctions')
    
    body = json.loads(event['body'])

    user = body['user']
    invitedEmail = body['invitedEmail']

    # Define the input for the Step Function
    input_data = {
        "user": user,
        "invitedEmail": invitedEmail
    }
    
    # Start the Step Function execution
    response = sf_client.start_execution(
        stateMachineArn='arn:aws:states:eu-central-1:522114191780:stateMachine:familyMemberSignup2021',
        input=json.dumps(input_data)
    )

    while True:
        response = sf_client.describe_execution(
            executionArn=response['executionArn']
        )
        if response['status'] != "RUNNING":
            break
        time.sleep(2) # don't need to check every nanosecond
    
    # Return the execution ARN or any other response as needed
    return create_response(200, response)