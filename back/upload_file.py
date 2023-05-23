import boto3
import json
from datetime import datetime
import os

def lambda_handler(event, context):
    # treba dodati owner-a (da li moze da se preuzme preko tokena?)
    # ownera dodati u tabelu
    # ownera treba dodati i u okviru naziva fajla, kao naziv foldera, kako bismo znali ciji je ciji resurs
    # i da bi razliciti korisnici mogli da imaju iste foldere
    # razdvojiti ovu funkciju na 2????
    # da li za serverless treba svakako da podesi kredencijale (kljuceve) kod sebe
    # da li je okej globalno postaviti role

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('mojatabelica')
    s3 = boto3.client('s3')
    bucket_name = 'mojakofica'

    file_path = event['filePath']
    file_type = file_path.split('.')[1] 
    file_name = event['fileName'] + '.' + file_type 
    file_created = datetime.fromtimestamp(os.path.getctime(file_path)).strftime('%Y-%m-%d %H:%M:%S')
    file_modified = datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d %H:%M:%S')
    file_size = os.path.getsize(file_path)
    description = event['description']
    tags = event['tags']    

    try:
        table.put_item(Item={'fileName':file_name, 'fileType':file_type, 'fileSize':file_size, 'fileCreated':file_created, 'fileModified':file_modified, 'description':description, 'tags':tags})
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=open(file_path, 'rb'))

        return {
            'statusCode': 200,
             "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps("File upload successful")
        }
    
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": True
            },
            "body": json.dumps("An error occurred while uploading the file")
        }
