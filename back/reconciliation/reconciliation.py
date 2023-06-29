import boto3
import os

table_name = os.environ['TABLE_NAME']
dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')

bucket_name = os.environ['BUCKET_NAME']
s3 = boto3.resource('s3')


def reconciliation():
    table = dynamodb.Table(table_name)
    bucket = s3.Bucket(bucket_name)

    try:
        # getting the list of files in S3 bucket
        s3_files = [obj.key for obj in bucket.objects.all()]

        # scan items in DynamoDB table
        db_items = table.scan()['Items']

        # comparing S3 files with DynamoDB items
        for file_name in s3_files:
            if not any(item['fileName'] == file_name for item in db_items):
                # file exists in s3 but not in dynamo
                bucket.delete_objects(Delete={'Objects': [{'Key': file_name}]})

        for item in db_items:
            if not any(obj.key == item['fileName'] for obj in bucket.objects.all()):
                # item exists in dynamo but not in s3
                table.delete_item(Key={'fileName': item['fileName']})

        # logging reconciliation process and results
        print("Reconciliation process completed successfully.")
        print(f"Number of S3 files: {len(s3_files)}")
        print(f"Number of DynamoDB items: {len(db_items)}")

        return {
            'statusCode': 200,
            'body': 'Reconciliation process completed successfully.'
        }
    except Exception as e:
        # handling any exceptions and implement necessary error handling logic
        print(f"An error occurred during reconciliation: {e}")
        return {
            'statusCode': 500,
            'body': 'Error occurred during reconciliation process.'
        }

reconcile_s3_dynamodb()
