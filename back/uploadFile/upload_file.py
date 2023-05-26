import boto3
import json
import os

from utility.utils import create_response

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb')

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.resource('s3')

def lambda_handler(event, context):
    # treba dodati owner-a (da li moze da se preuzme preko tokena?)
    # ownera dodati u tabelu
    # ownera treba dodati i u okviru naziva fajla, kao naziv foldera, kako bismo znali ciji je ciji resurs
    # i da bi razliciti korisnici mogli da imaju iste foldere
    # razdvojiti ovu funkciju na 2
    body = json.loads(event['body'])

    table = dynamodb.Table(table_name)
    bucket = s3.Bucket(bucket_name)

    # Put item into table
    table.put_item(Item={'fileName':body["fileName"], 'fileType':body["fileType"], 'fileSize':body["fileSize"], 'fileCreated':body["fileCreated"], 'fileModified':body["fileModified"], 'description':body["description"], 'tags':body["tags"]})
    # Upload file to s3
    bucket.put_object(Bucket=bucket_name, Key=body["fileName"], Body=bytes(body["fileContent"], 'utf-8'))

    # Create response
    body = {
        'message': 'Successfully upload file'
    }
    return create_response(200, body)
