import json
import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'events-table'
dynamo_db = boto3.resource(SERVICE, region_name=AWS_REGION)
events_table = dynamo_db.Table(DYNAMO_DB_TABLE_NAME)
ses_client = boto3.client('ses', region_name=AWS_REGION)

email_subject = "Watch Party Invitation!"
from_email = "watchpartyfall2021@gmail.com"
to_email = "spa2138@columbia.edu"
CHARSET = "UTF-8"


def send_email(email_body):
    response = ses_client.send_email(
        Destination={
            'ToAddresses': [
                str(to_email),
            ],
        },
        Message={
            'Body': {
                'Text': {
                    'Charset': CHARSET,
                    'Data': email_body,
                },
            },
            'Subject': {
                'Charset': CHARSET,
                'Data': email_subject,
            },
        },
        Source=str(from_email),
    )


def send_events_notifications(events_details):
    sentence_two = "You have been invited for the Watch Party Event scheduled at: {} \n".format(
        events_details['startEventTime'])
    sentence_three = "Please join the event using the link: {} \n See you in the Watch Party! Cheers!".format(
        events_details['eventInvitationLink'])
    for user in events_details['user']:
        sentence_one = "Hey Hi {} \n".format(user['userName'])
        body = sentence_one + sentence_two + sentence_three
        send_email(body)


def lambda_handler(event, context):
    print("Event:{}".format(event))
    latest_event_id = event['Records'][0]['dynamodb']['Keys']['eventID']['S']
    response = events_table.scan()
    items = response['Items']
    for item in items:
        if item['eventID'] == latest_event_id:
            events_details = item
            send_events_notifications(events_details)
            return_json = {'statusCode': 200,
                           'body': json.dumps('Notification successfully sent for eventID:{}'.format(latest_event_id))}
            return return_json
    return {'statusCode': 200,
            'body': json.dumps('Record not found in events-table for EventID:{}'.format(latest_event_id))}
