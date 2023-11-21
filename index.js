const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const port = 3000;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
app.use(bodyParser.json());

AWS.config.update({
  region: 'us-east-1', 
  accessKeyId: 'key_id', 
  secretAccessKey: 'Secret_key' 
});

const poolData = {
    UserPoolId: 'us-east-1_xWIdGj5H3',
    ClientId: '1dsbtf5csii2r2tvc40hlt4599',
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function login(username, password, callback) {
  const authenticationData = {
    Username: username,
    Password: password
  };

  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
    
      const accessToken = result.getAccessToken().getJwtToken();
      const cognitoUsername = cognitoUser.getUsername();
      
      callback(null, { accessToken, username: cognitoUsername });
    },
    onFailure: function (err) {
      callback(err);
    }
  });
}

const username = 'nigalraj';
const password = 'Nigalraj@1';

login(username, password, (err, accessToken) => {
  if (err) {
    console.error('Login failed:', err);
  } else {
    console.log('Login successful! Access Token:', accessToken);
  }
});


app.listen(port, ()=>{
    console.log('Server is running');
})
