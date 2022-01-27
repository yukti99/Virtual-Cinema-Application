import json
import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'messages-table'
cognito_client = boto3.client("cognito-idp", region_name="us-east-1")
dynamo_db = boto3.resource(SERVICE, region_name=AWS_REGION)
events_table = dynamo_db.Table(DYNAMO_DB_TABLE_NAME)


def lambda_handler(event, context):
    try:
        message_id = event['pathParameters']['messageID']
        response = events_table.scan()
        items = response['Items']
        for item in items:
            if item['messageID'] == message_id:
                return_json = {'statusCode': 200, 'body': json.dumps(item)}
                print("return_json:{}".format(return_json))
                return return_json

        return {'statusCode': 200, 'body': "Record not found for the eventID:{}".format(event_id)}
    except Exception as e:
        message = str(e)
        return {'StatusCode': '4XX', 'body': "Error occurred:{}".format(message)}
