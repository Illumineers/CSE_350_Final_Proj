Hello! This is the code source for our final project for CSE 350.

Here I will explain the architecture of our website and arduino, and how it all functions.

Website:
The website, which you can view [here](http://350site.s3-website-us-east-1.amazonaws.com/), is a React app hosted on AWS, using its s3 bucket system. 
All the files from the front-end of our react app are hosted there. In order for the website to interact with the arduino, we had to create a database. 
Our database is a NoSQL Dynamo DB, another toolkit from AWS. In order for the website to post and read from the database, we used an API Gateway and corresponding
lambda functions to allow for the neccesary communication. Posted in our files are the lambda functions that the site uses. The sendBool function just
updates a True or False value within our database that corresponds to whether the user is using weather data to change the color of their lights, or RGB values.
The read function allows the arduino to read all data from the database. The write function allows the user to update weather data in the database. The sendColor
function allows the user to send RGB values to the database. All of this work is done through the database's API gateway. To get the data for the weather, we
used the OpenWeather api. This provided us with a current forecast for anywhere in the world. All a user has to do is search for the city name they want to
recieve weather for.

Arduino:
As mentioned earlier, the arduino also uses a fetch request to our API gateway to recieve all the data from the database. It uses the read function to do so. It
recieves the data in a JSON form, and parses through it to get the necessary values. It uses the bool T/F to decide whether to use weather data, 
and uses the data from the weather to display certain patterns to the LEDs based on current weather conditions. If the bool is set to false, it will use the
RGB values stored in the database to display a static color. If a user wants to display a certain color, they can use the color selector tool to update the color of the lights.

