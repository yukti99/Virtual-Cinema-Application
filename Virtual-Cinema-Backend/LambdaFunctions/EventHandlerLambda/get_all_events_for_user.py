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
        jwt_token = event['headers']['jwtToken']
        response = cognito_client.get_user(AccessToken=jwt_token)
        user_id = response['UserAttributes'][0]['Value']
        all_events_data = []
        response = events_table.scan()
        items = response['Items']
        for item in items:
            for user in item['user']:
                if user['userID'] == user_id:
                    all_events_data.append(item)
                    break

        if len(all_events_data) == 0:
            message = "No events information found for the given user"
            body = {'message': message}
        else:
            body = {'all_events_data': all_events_data}
        return {'statusCode': 200, 'body': json.dumps(body)}
    except Exception as e:
        message = {'message': str(e)}
        return {'statusCode': '4XX', 'body': json.dumps(message)}
