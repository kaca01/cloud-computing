import boto3
import json
import os
import base64

from utility.utils import create_response

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
bucket_name = os.environ['BUCKET_NAME']
table_name = os.environ['TABLE_NAME']

userPoolId = 'eu-central-1_0X24Fz6lx'
clientId = '72tip32rlft3qhhogtbhcfkivj'

def lambda_handler(event, context):
    return create_response(200, event)