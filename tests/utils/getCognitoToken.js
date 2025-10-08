const AWS = require('aws-sdk');
require('dotenv').config();
async function getCognitoIdToken({ username, password }) {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };
  const result = await cognito.initiateAuth(params).promise();
  return result.AuthenticationResult.IdToken;
}

module.exports = getCognitoIdToken;
