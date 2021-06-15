/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamo = new AWS.DynamoDB.DocumentClient();

let tableName = 'dashboardTable';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
}

// const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = 'userId';
const partitionKeyType = 'S';
const sortKeyName = 'dashId';
const sortKeyType = 'S';
const hasSortKey = sortKeyName !== '';
const path = '/dashboards';
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case 'N':
      return Number.parseInt(param);
    default:
      return param;
  }
};

const getUserId = (req) => {
  try {
    console.log('getting userId');
    console.log({ requestContext: req.apiGateway.event.requestContext });
    const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/;
    const authProvider = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider;
    const [, , , userId] = authProvider.match(IDP_REGEX);
    console.log('userId: ', userId);
    return userId;
  } catch (err) {
    console.log('unable to retrieve userId: ', err);
    return UNAUTH;
  }
};

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function (req, res) {
  // console.log('inside the lambda!!');
  console.log('accessing data boop boop');
  console.log({ apiGatewayEvent: req.apiGateway.event });
  // console.log({ event: req.apiGateway.event.requestContext.identity });
  // console.log({ event: req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider });
  // const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/;
  // const authProvider = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider;
  // const [, , , userId] = authProvider.match(IDP_REGEX);
  // console.log('userId: ', userId);
  // console.log('what on earth is happening here');
  console.log({ request: req });

  const userId = getUserId(req);
  console.log({ userId: userId });

  const condition = {};
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  };

  if (userId && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [userId || UNAUTH];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [convertUrlType(req.params[partitionKeyName], partitionKeyType)];
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  const queryParams = {
    TableName: tableName,
    KeyConditions: condition
  };

  console.log(JSON.stringify({ params: queryParams }));

  dynamo.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      console.log(JSON.stringify({ data: data.Items }));
      res.status(200);
      res.json({ data: data.Items });
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

// app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
//   var params = {};
//   if (userIdPresent && req.apiGateway) {
//     params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   } else {
//     params[partitionKeyName] = req.params[partitionKeyName];
//     try {
//       params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({ error: 'Wrong column type ' + err });
//     }
//   }
//   if (hasSortKey) {
//     try {
//       params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
//     } catch(err) {
//       res.statusCode = 500;
//       res.json({ error: 'Wrong column type ' + err });
//     }
//   }

//   let getItemParams = {
//     TableName: tableName,
//     Key: params
//   };

//   dynamo.get(getItemParams,(err, data) => {
//     if(err) {
//       res.statusCode = 500;
//       res.json({ error: 'Could not load items: ' + err.message });
//     } else {
//       if (data.Item) {
//         res.json(data.Item);
//       } else {
//         res.json(data) ;
//       }
//     }
//   });
// });

// /************************************
// * HTTP put method for insert object *
// *************************************/

// app.put(path, function(req, res) {

//   if (userIdPresent) {
//     req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   }

//   let putItemParams = {
//     TableName: tableName,
//     Item: req.body
//   };
//   dynamo.put(putItemParams, (err, data) => {
//     if(err) {
//       res.statusCode = 500;
//       res.json({ error: err, url: req.url, body: req.body });
//     } else{
//       res.json({ success: 'put call succeed!', url: req.url, data: data });
//     }
//   });
// });

// /************************************
// * HTTP post method for insert object *
// *************************************/

app.post(path, function (req, res) {
  console.log('postDashboard lambda');
  console.log({ apiGatewayEvent: req.apiGateway.event });
  console.log({ request: req });
  // return res.json({ test: 'this is a test' });

  const userId = getUserId(req);
  console.log({ userId: userId });

  // if (userId) {
  //   req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // }

  if (!req.body.key) {
    res.json({ error: 'missing dashboard key' });
  }
  if (!req.body.name) {
    res.json({ error: 'missing dashboard name' });
  }

  const dashboard = {
    dashId: 'dash_' + uuidv4(),
    userId: userId,
    bucketId: req.body.key,
    name: req.body.name || 'My Dashboard',
    createdOn: new Date().toISOString()
  };

  const putItemParams = {
    TableName: tableName,
    Item: dashboard
  };

  console.log(JSON.stringify({ putItemParams: putItemParams }));

  dynamo.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      console.log({ err: err });
      res.json({
        msg: 'failed to add dashboard',
        error: err,
        url: req.url,
        body: req.body
      });
    } else {
      console.log({ data: data });
      res.statusCode = 200;
      res.json({
        success: 'post call succeed!',
        url: req.url,
        data: data,
        dashboard: dashboard
      });
    }
  });
});

// /**************************************
// * HTTP remove method to delete object *
// ***************************************/

app.delete(path + '/:dashId', function (req, res) {
  console.log('deleteDashboard lambda');
  console.log({ apiGatewayEvent: req.apiGateway.event });
  console.log({ request: req });

  const userId = getUserId(req);
  console.log({ userId: userId });

  let dashId = null;

  if (!req.body.dashId) {
    res.json({ error: 'missing dashId' });
  } else {
    dashId = req.body.dashId;
  }
  if (!userId) {
    res.json({ error: 'missing userId' });
  }

  const deleteItemParams = {
    TableName: tableName,
    Key: {
      dashId: dashId,
      userId: userId
    },
    ConditionExpression: ''
  };

  if (userId != null && typeof (userId) !== 'undefined') {
    deleteItemParams.ExpressionAttributeValues = {
      ':userId': userId
    };
    deleteItemParams.ConditionExpression = 'userId = :userId';
  }

  // if (userIdPresent && req.apiGateway) {
  //   params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // } else {
  //   params[partitionKeyName] = req.params[partitionKeyName];
  //    try {
  //     params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
  //   } catch(err) {
  //     res.statusCode = 500;
  //     res.json({ error: 'Wrong column type ' + err });
  //   }
  // }
  // if (hasSortKey) {
  //   try {
  //     params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
  //   } catch(err) {
  //     res.statusCode = 500;
  //     res.json({ error: 'Wrong column type ' + err });
  //   }
  // }

  // let deleteItemParams = {
  //   TableName: tableName,
  //   params
  // };

  console.log(JSON.stringify({ deleteItemParams: deleteItemParams }));

  dynamo.delete(deleteItemParams, (err, data) => {
    console.log('running dynamo.delete call');
    if (err) {
      console.log({ err: err });
      res.statusCode = 500;
      res.err = err;
      res.json({
        msg: 'Problem deleting dashboard', error: err, url: req.url, body: req.body
      });
    } else {
      console.log({ deleteData: data });
      res.statusCode = 200;
      res.json({ success: 'successful delete!', url: req.url, data: data });
    }
  });
});

app.listen(3000, function () {
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
