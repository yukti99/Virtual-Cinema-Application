import json
import boto3
import datetime

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'messages-table'
SQS_QUEUE_NAME = "vidsync-send-messages.fifo"
FIFO_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/201565561775/vidsync-send-messages.fifo"
cognito_client = boto3.client("cognito-idp", region_name="us-east-1")
sqs_client = boto3.client('sqs')


def lambda_handler(event, context):
    jwt_token = event['headers']['jwtToken']
    response = cognito_client.get_user(AccessToken=jwt_token)
    user_id = response['UserAttributes'][0]['Value']
    name = response['UserAttributes'][2]['Value']
    timestamp = datetime.datetime.now().isoformat()

    event_id = event['body']['eventID']
    message = event['body']['messageText']
    message_type = "text"

    message_body = {
        'timestamp': timestamp,
        'userID': user_id,
        'user': {
            'name': name
        },
        'eventID': event_id,
        'message': message,
        'message_type': message_type
    }

    queue_url_response = sqs_client.get_queue_url(QueueName=SQS_QUEUE_NAME, )
    print("queue_url_response:{}".format(queue_url_response))
    print("queue_url_response:{}".format(queue_url_response))
    send_response = sqs_client.send_message(
        QueueUrl=FIFO_QUEUE_URL,
        MessageBody=json.dumps(message_body),
        MessageGroupId=event_id
    )
    message_body['MessageId'] = send_response['MessageId']

    return {
        'statusCode': 200,
        'body': json.dumps(message_body)
    }
