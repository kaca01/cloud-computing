import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')

def lambda_handler(event, context):

    user = event['user']
    invitedEmail = event['invitedEmail']  # send email to this email
    #todo user['email'] should be written in path of front page (link) -> onda na frontu u nginit pozvati cognito preuzeti taj mail i kreirati korisnika
    #todo ako je prethodno uspjesno, pozvati lambda funkciju za davanje prava za root folder tom korisniku

    # you can change response to whatever you want
    data = {
            "user" : user,
            "invitedEmail": invitedEmail
        }
    return create_response(200, data)