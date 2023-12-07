const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        let useWeather;
        useWeather = event

        const params = {
            TableName: '350tale',
            Key: {
                "type": "useCase", 
            },
            UpdateExpression: 'SET useWeather = :useWeather',
            ExpressionAttributeValues: {
                ':useWeather': !useWeather,
            },
            ReturnValues: 'ALL_NEW',
        };

        const result = await dynamodb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        console.error('Error in Lambda function:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error updating DynamoDB item', details: error.message }),
        };
    }
};