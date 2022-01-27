import json
import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'messages-table'
db = boto3.resource(SERVICE, region_name=AWS_REGION)
messages_table = db.Table(DYNAMO_DB_TABLE_NAME)


def lambda_handler(event, context):
    event_id = event['pathParameters']['eventID']
    response = messages_table.scan()
    items = response['Items']
    message_id_dict = {}
    for row in items:
        if row['eventID'] == event_id:
            message_id_dict[row['messageID']] = row['timestamp']

    if len(message_id_dict) == 0:
        message = "No records found in messages for eventID: {}".format(event_id)
        return {'statusCode': 200, 'body': json.dumps(message)}
    ordered_msg_ids = list(sorted(message_id_dict, key=message_id_dict.get, reverse=False))

    event_messages_in_order = []
    for message_id in ordered_msg_ids:
        message_record_from_db = messages_table.get_item(Key={'messageID': message_id})
        required_info = message_record_from_db['Item']
        event_messages_in_order.append(required_info)

    return_dict = {'statusCode': 200, 'body': json.dumps(event_messages_in_order)}
    print("return_dict:{}".format(return_dict))
    return return_dict
