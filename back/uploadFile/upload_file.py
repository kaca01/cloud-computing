import boto3
import json
import os
import base64
import time

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

    max_retries = 3
    retries = 0
    is_added_to_table = False
    while retries < max_retries:
        try:
            # Put item into table
            if not is_added_to_table:
                table.put_item(Item={'fileName': body["fileName"],
                                     'fileType': body["fileType"],
                                     'fileSize': body["fileSize"],
                                     'fileCreated': body["fileCreated"],
                                     'fileModified': body["fileModified"],
                                     'description': body["description"],
                                     'tags': body["tags"]})
            # this means that
            is_added_to_table = True
            # Upload file to s3
            decoded_data = base64.b64decode(body["fileContent"].split(',')[1].strip())
            bucket.put_object(Bucket=bucket_name, Key=body["fileName"], Body=decoded_data)
        except Exception as e:
            print(f"Error adding item to DynamoDB: {e}")
            retries += 1
            if retries < max_retries:
                backoff_time = 2 ** retries
                print(f"Retrying after {backoff_time} seconds...")
                time.sleep(backoff_time)
            else:
                if is_added_to_table:
                    bucket.delete_objects(Delete={'Objects': [{'Key': body["fileName"]}]})
                body = {
                    'message': 'Error occurred during file upload'
                }
                return create_response(500, body)

    body = {
        'message': 'Successful file upload'
    }
    return create_response(200, body)
