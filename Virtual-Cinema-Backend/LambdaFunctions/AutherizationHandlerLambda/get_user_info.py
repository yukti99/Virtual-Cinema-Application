import json
import boto3
AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'user-information-table'
cognito_client = boto3.client("cognito-idp", region_name="us-east-1")

def lambda_handler(event, context):
    jwt_token = event['headers']['jwtToken']
    db = boto3.resource(SERVICE, region_name=AWS_REGION)
    user_information_table = db.Table(DYNAMO_DB_TABLE_NAME)
    response = cognito_client.get_user(AccessToken=jwt_token)
    user_id = response['UserAttributes'][0]['Value']
    response = user_information_table.scan()
    items = response['Items']

    for item in items:
        if item['userID'] == user_id:
            body = json.dumps(item)
            return_json = {'statusCode': 200, 'body': body}
            return return_json
    return_json = {'statusCode': 200, 'body': "Record not found for the user:{}".format(user_id)}
    return return_json
