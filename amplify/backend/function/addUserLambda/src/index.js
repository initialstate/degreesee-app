const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const date = new Date();

  if (event.request.userAttributes.sub) {
    const attr = 'custom:dashboard';
    const bktId = event.request.userAttributes[attr];

    const params = {
      Item: {
        userId: { S: event.request.userAttributes.sub },
        dashId: { S: 'dash_' + uuidv4() },
        bucketId: { S: bktId },
        name: { S: 'My Dashboard' },
        createdOn: { S: date.toISOString() }
      },
      TableName: process.env.STORAGE_DASHBOARDTABLE_NAME
    };
    // Call DynamoDB
    try {
      await ddb.putItem(params).promise();
      console.log('Successfully added user');
    } catch (err) {
      console.log('Error', err);
    }

    context.done(null, event);
  } else {
    console.log('Error: no user data available. User not created.');
    context.done(null, event);
  }
};
