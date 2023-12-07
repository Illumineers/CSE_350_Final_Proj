const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        let weatherData;
        weatherData = event;

        const params = {
            TableName: '350tale',
            Item: {
                "type": "Weather",
                "coord": weatherData.coord,
                "main": weatherData.main,
                "name": weatherData.name,
                "weather": weatherData.weather,
                "wind": weatherData.wind,
            },
        };

        await dynamodb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Weather data successfully added to DynamoDB' }),
        };
    } catch (error) {
        console.error('Error in Lambda function:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error adding weather data to DynamoDB', details: error.message }),
        };
    }
};