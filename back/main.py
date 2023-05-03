import boto3
import os
import datetime
import json

aws_access_key = 'AKIAXTEDOKGSG3RZHLUF'
aws_secret_access_key = '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'

session = boto3.Session(
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_access_key
)

# Creating high level object for interacting with S3 service
s3_client = session.client('s3')

bucket_name = 'nekakofa'

def create_bucket():
    # Creating S3 bucket
    print("=== Create bucket ===")
    return s3_client.create_bucket(Bucket=bucket_name)

def list_buckets():
    # List all existing S3 buckets
    print("=== List buckets ===")
    response = s3_client.list_buckets()
    for bucket in response['Buckets']:
        print(f"\t{bucket['Name']}")

def upload_file(file_path, file_name, description='', tags={}):
    # Write file to bucket
    print("=== Write file to bucket ===")

    file_size = os.path.getsize(file_path)
    file_type = file_path.split('.')[1]  
    file_created_time = datetime.datetime.fromtimestamp(os.path.getctime(file_path)).strftime('%Y-%m-%d %H:%M:%S')
    file_modified_time = datetime.datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d %H:%M:%S')

    s3_client.put_object(
        Bucket=bucket_name,
        Key=file_name,
        Body=open(file_path, 'rb'),
        ContentType=file_type,
        ContentLength=file_size,
        Metadata={
            'created-time': str(file_created_time),
            'last-modified-time': str(file_modified_time),
            'description': description
        }
    )
    
    if tags:
        s3_client.put_object_tagging(
            Bucket=bucket_name,
            Key=file_name,
            Tagging={
                'TagSet': [{'Key': k, 'Value': v} for k, v in tags.items()]
            },
        )

def list_objects():
    # List all objects in bucket
    print("=== List all objects in bucket ===")
    response = s3_client.list_objects(Bucket=bucket_name)
    try:
        for o in response['Contents']:
            print(f"\t{o['Key']}")
    except (KeyError):
        print(f"\tNo content in bucket")

def delete_object(file_name):
    print("=== Delete object from bucket ===")
    s3_client.delete_objects(Bucket=bucket_name, Delete={'Objects': [{'Key': file_name}]})

def delete_bucket():
    # Delete bucket
    print("=== Delete bucket ===")
    s3_resource = session.resource('s3')
    bucket = s3_resource.Bucket(bucket_name)
    bucket.objects.all().delete()
    bucket.delete()

if __name__ == '__main__':
    # create_bucket()
    # list_buckets()
    # upload_file('sunflower.png', 'glupo','ovo je opis slike', {'kljuc': 'vrednost', 'anastasija': 'carina'})
    # list_objects()
    # delete_object('mojaslika')
    delete_bucket()
