import json
import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'events-table'
db = boto3.resource(SERVICE, region_name=AWS_REGION)
table = db.Table(DYNAMO_DB_TABLE_NAME)


def lambda_handler(event, context):
    try:
        events_information = eval(event['body'])

        response = table.put_item(Item=events_information)
        status_code = response['ResponseMetadata']['HTTPStatusCode']

        if status_code == 200:
            message = {'message': 'Successfully added user information'}
            return_dict = {'statusCode': status_code, 'body': json.dumps(message)}
        else:
            message = {'message': 'Something went wrong while adding user information'}
            return_dict = {'statusCode': status_code, 'body': json.dumps(message)}
        return return_dict
    except Exception as e:
        message = {'message': str(e)}
        return {'statusCode': '4XX', 'body': json.dumps(message)}


