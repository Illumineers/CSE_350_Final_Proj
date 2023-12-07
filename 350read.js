const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const params = {
        TableName: '350tale', // Replace with your actual table name
    };

    try {
        const data = await dynamodb.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error reading items from DynamoDB', details: error }),
        };
    }
};
