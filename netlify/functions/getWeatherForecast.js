require("dotenv").config();

const axios = require("axios");

exports.handler = async (event, context) => {
  // returns weather forecast for the  location and number of days provided
  
  try {

    const {location, nbrDays} = event.queryStringParameters;
    console.log('location in fetchWeatherForecast: ', location);
    console.log('number of days: ', nbrDays);
    console.log('URL: ',`${process.env.APP_WEATHER_API_ENDPOINT}?q=${location}&key=${process.env.APP_WEATHER_API_KEY}&days=${nbrDays}&aqi=no&alerts=no`);
    const response = await axios.get(`${process.env.APP_WEATHER_API_ENDPOINT}?q=${location}&key=${process.env.APP_WEATHER_API_KEY}&days=${nbrDays}&aqi=no&alerts=no`, 
    {
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
      params: { trophies: true },
    })
    
   
    const data = response.data;
    console.log('response data: ', data.forecast);
    if (data.hasOwnProperty('error')) {
      let error = data.error;
      return {
        statusCode: 500,
        body: JSON.stringify({  'error': `${error}` }),
      };
    }else{
      console.log('Got weather forecast successfully');
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }
  } catch (error) {
    console.log("error: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 'error': `${error}` }),
    };
  }

}
