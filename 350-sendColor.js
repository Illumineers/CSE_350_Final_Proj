const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event));


    const requestBody = event;
    const { r, g, b } = requestBody;

    const params = {
        TableName: '350tale',
        Key: {
            type: {
                S: 'useColor'
            }
        },
        UpdateExpression: 'SET #r = :r, #g = :g, #b = :b',
        ExpressionAttributeNames: {
            '#r': 'r',
            '#g': 'g',
            '#b': 'b',
        },
        ExpressionAttributeValues: {
            ':r': { N: r.toString() },
            ':g': { N: g.toString() },
            ':b': { N: b.toString() },
        },
        ReturnValues: 'ALL_NEW',
    };

    console.log('Updating DynamoDB:', JSON.stringify(params));

    const updatedItem = await dynamoDB.updateItem(params).promise();
    console.log('Item updated:', JSON.stringify(updatedItem));

    return {
        statusCode: 200,
        body: JSON.stringify('Item updated successfully'),
    };
};