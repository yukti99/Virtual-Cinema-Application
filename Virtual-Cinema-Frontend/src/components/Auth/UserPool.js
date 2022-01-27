import {CognitoUserPool} from "amazon-cognito-identity-js"


const poolData = {
    region: 'us-east-1',
    UserPoolId: 'us-east-1_S9e45Pa7p',
    ClientId: '37eql2cpi0h1m763k1okkqk0ff',
}

export default new CognitoUserPool(poolData);