import boto3

aws_access_key = 'AKIAXTEDOKGSG3RZHLUF'
aws_secret_access_key = '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'

session = boto3.Session(
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_access_key
)

def hello_s3():
    # Creating high level object for interacting with S3 service
    s3_client = session.client('s3')

    bucket_name = 'kofetina'

    # Creating S3 bucket
    print("=== Create bucket ===")
    bucket = s3_client.create_bucket(Bucket=bucket_name)
    
    # List all existing S3 buckets
    print("=== List buckets ===")
    response = s3_client.list_buckets()
    for bucket in response['Buckets']:
        print(f"\t{bucket['Name']}")

    # Write object to bucket
    print("=== Write object to bucket ===")
    file_name = 'object.json'
    object_key = 'object1'
    s3_client.upload_file(file_name, bucket_name, object_key)

    # List all objects in bucket
    print("=== List all objects in bucket ===")
    response = s3_client.list_objects(Bucket=bucket_name)
    for o in response['Contents']:
        print(f"\t{o['Key']}")
    
    # Delete object
    print("=== Delete object from bucket ===")
    # s3_client.delete_objects(Bucket=bucket_name, Delete={'Objects': [{'Key': object_key}]})

    # List all objects in bucket
    print("=== List all objects in bucket ===")
    response = s3_client.list_objects(Bucket=bucket_name)
    try:
        for o in response['Contents']:
            print(f"\t{o['Key']}")
    except (KeyError):
        print(f"\tNo content in bucket")


if __name__ == '__main__':
    hello_s3()
