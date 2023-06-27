import os
import boto3
import json
from utility.utils import create_response

# bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.resource('s3')
source_bucket = os.environ['BUCKET_NAME']


def create_folder(event, context):
    body = event['body']

    folder_key = body['folderName'] + '/'
    s3.Object(source_bucket, folder_key).put()

    body = {
        'message': 'Successfully created folder'
    }
    return create_response(200, body)


# moving all files from one folder to another
def move_files(source_folder, destination_folder):
    s3 = boto3.client('s3')
    response = s3.list_objects_v2(Bucket=source_bucket, Prefix=source_folder)
    objects = response.get('Contents', [])

    # move each object from the source folder to the destination folder
    for obj in objects:
        file_name = obj['Key']
        new_key = file_name.replace(source_folder, destination_folder, 1)

        # copy the object to the destination folder
        s3.copy_object(
            Bucket=source_bucket,
            Key=new_key,
            CopySource={'Bucket': source_bucket, 'Key': file_name}
        )

        # Delete the object from the source folder
        s3.delete_object(Bucket=source_bucket, Key=file_name)

    body = {
        'message': 'Successfully moved files'
    }
    return create_response(200, body)


# this is only for testing purposes
def rollback_move_files(source_folder, destination_folder):
    s3 = boto3.client('s3')

    # List objects in the destination folder
    response = s3.list_objects_v2(Bucket=source_bucket, Prefix=destination_folder)
    objects = response.get('Contents', [])

    # Move each object from the destination folder to the source folder
    for obj in objects:
        file_name = obj['Key']
        new_key = file_name.replace(destination_folder, source_folder, 1)

        # Copy the object to the source folder
        s3.copy_object(
            Bucket=source_bucket,
            Key=new_key,
            CopySource={'Bucket': source_bucket, 'Key': file_name}
        )

        # Delete the object from the destination folder
        s3.delete_object(Bucket=source_bucket, Key=file_name)


def move_file(source_folder, destination_folder, file_name):
    s3 = boto3.client('s3')

    # Construct the source and destination keys
    source_key = source_folder + file_name
    destination_key = destination_folder + file_name

    # Copy the object to the destination folder
    s3.copy_object(
        Bucket=source_bucket,
        Key=destination_key,
        CopySource={'Bucket': source_bucket, 'Key': source_key}
    )

    # Delete the object from the source folder
    s3.delete_object(Bucket=source_bucket, Key=source_key)

    body = {
        'message': 'Successfully moved file'
    }
    return create_response(200, body)


# move_file('neki_folder/', 'prvi_folder/', 'nekifajl.docx')
