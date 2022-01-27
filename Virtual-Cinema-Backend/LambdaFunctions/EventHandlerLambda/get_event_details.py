import json
import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'events-table'
cognito_client = boto3.client("cognito-idp", region_name="us-east-1")
dynamo_db = boto3.resource(SERVICE, region_name=AWS_REGION)
events_table = dynamo_db.Table(DYNAMO_DB_TABLE_NAME)


def lambda_handler(event, context):
    try:
        event_id = event['pathParameters']['id']
        response = events_table.scan()
        items = response['Items']
        for item in items:
            if item['eventID'] == event_id:
                return_json = {'statusCode': 200, 'body': json.dumps(item)}
                return return_json

        return {'statusCode': 200, 'body': "Record not found for the eventID:{}".format(event_id)}
    except Exception as e:
        message = str(e)
        return {'statusCode': '4XX', 'body': "Error occurred:{}".format(message)}

