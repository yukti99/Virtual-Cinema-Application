import boto3

AWS_REGION = 'us-east-1'
SERVICE = 'dynamodb'
DYNAMO_DB_TABLE_NAME = 'user-information-table'
cognito_client = boto3.client("cognito-idp", region_name="us-east-1")


def lambda_handler(event, context):
    try:
        db = boto3.resource(SERVICE, region_name=AWS_REGION)
        table = db.Table(DYNAMO_DB_TABLE_NAME)

        jwt_token = event['headers']['jwtToken']
        response = cognito_client.get_user(AccessToken=jwt_token)
        user_id = response['UserAttributes'][0]['Value']
        name = response['UserAttributes'][2]['Value']
        email = response['UserAttributes'][3]['Value']

        table_row = {'userID': user_id, 'name': name, 'email': email}
        response = table.put_item(Item=table_row)
        status_code = response['ResponseMetadata']['HTTPStatusCode']

        if status_code == 200:
            message = 'Successfully added user information'
        else:
            message = "Something went wrong. Could not store the user information"

        return_dict = {'statusCode': status_code, 'body': message}
    except Exception as e:
        message = str(e)
        return_dict = {'statusCode': '4XX', 'body': message}

    return return_dict
