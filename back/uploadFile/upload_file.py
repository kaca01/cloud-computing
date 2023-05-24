import boto3
import json
from datetime import datetime
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

    file_path = event['filePath']
    file_type = file_path.split('.')[1] 
    file_name = event['fileName'] + '.' + file_type 
    file_created = datetime.fromtimestamp(os.path.getctime(file_path)).strftime('%Y-%m-%d %H:%M:%S')
    file_modified = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d %H:%M:%S')
    file_size = os.path.getsize(file_path)
    description = event['description']
    tags = event['tags']    

    table = dynamodb.Table(table_name)
    bucket = s3.Bucket(bucket_name)

    # Put item into table
    table.put_item(Item={'fileName':file_name, 'fileType':file_type, 'fileSize':file_size, 'fileCreated':file_created, 'fileModified':file_modified, 'description':description, 'tags':tags})
    # Upload file to s3
    bucket.upload_file(Filename=file_path, Key=file_name)

    # Create response
    body = {
        'message': 'Successfully upload file'
    }
    return create_response(200, body)
