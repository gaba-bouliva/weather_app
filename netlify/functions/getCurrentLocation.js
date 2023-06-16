require("dotenv").config();

const axios = require("axios");

exports.handler = async () => {
  // retrieves user IP location data from api
  try {
   
    // const response = await fetch(`${process.env.APP_IP_INFO_ENDPOINT}?apiKey=${process.env.APP_IP_INFO_API_KEY}`, {
    //   mode: 'cors',
    //   headers: {
    //       'Content-Type': 'application/json',
    //   }
    // });
    let response = await axios.get(
      `${process.env.APP_IP_INFO_ENDPOINT}?apiKey=${process.env.APP_IP_INFO_API_KEY}`,
      {
        headers: { Accept: "application/json", "Accept-Encoding": "identity" },
        params: { trophies: true },
      }
    )

    const data = response.data;
    
    console.log('user location data: ', data);
    if (data.hasOwnProperty('error')) {
      let error = data.error;
      return {
        statusCode: 500,
        body: JSON.stringify({  'error': `${error}` }),
      };
    }else{
      console.log('No error');
      const location = {'name': data.city.name, 'country': data.country.name, 'lat': data.location.latitude, 'lon': data.location.longitude}

      return {
        statusCode: 200,
        body: JSON.stringify(location),
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


