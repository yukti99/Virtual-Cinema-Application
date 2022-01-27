import json
import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'messages-table'
db = boto3.resource(SERVICE, region_name=AWS_REGION)
messages_table = db.Table(DYNAMO_DB_TABLE_NAME)


def lambda_handler(event, context):
    message_id = event['Records'][0]['messageId']
    queue_message = event['Records'][0]['body']
    message_to_db = json.loads(queue_message)

    message_to_db['messageID'] = message_id

    response = messages_table.put_item(Item=message_to_db)
    message = {'messageID': message_id, 'eventID': message_to_db['eventID']}

    status_code = response['ResponseMetadata']['HTTPStatusCode']

    return_dict = {'statusCode': status_code, 'body': json.dumps(message)}
    return return_dict
