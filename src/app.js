/**
 * TODO
 * 1 get user current location
 * 2 get user current location weather fromm weather api
 * 3 populate various weather info on weather app
 * 4 populate corresponding weather icons base on weather
 * 4 implement search location city/country
 */

const envVariables = process.env;
let currentLocation = null;
let weatherInfo = null;

const {
  APP_TITLE,
  APP_ENV,
  APP_WEATHER_API_KEY,
  APP_WEATHER_API_ENDPOINT,
  APP_GIPHY_API_KEY,
  APP_GIPHY_API_ENDPOINT,
  APP_IP_INFO_API_KEY,
  APP_IP_INFO_ENDPOINT
}  = envVariables;

async function fetchUserCurrentLocation() {
  // retrieves user IP location data from api
  try {
    const response = await fetch(`${APP_IP_INFO_ENDPOINT}?apiKey=${APP_IP_INFO_API_KEY}`, {
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log('user location data: ', data);
    if (data.hasOwnProperty('error')) {
      throw(error)
    }else{
      setLocation(JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
  }
  getCurrentLocation();

}

async function fetchWeatherData(location) {
  // retrieves provided location weather info
  console.log('weatherLocation: ', location);
  try {
  
    const response = await fetch(`${APP_WEATHER_API_ENDPOINT}?q=${location.city}&key=${APP_WEATHER_API_KEY}`, {
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log('location weather data: ', data);
    if (data.hasOwnProperty('error')) {
      throw(error)
    }else{
      setWeatherInfo(JSON.stringify(data));
    }
  } catch (error) {
    console.log(error);
  }
}

function getCurrentLocation () {
  // return user location data cached in browser local storage
  let locationData = JSON.parse(localStorage.getItem('location'));
  if ( locationData.hasOwnProperty('city') && locationData.hasOwnProperty('country')) {
    
    return {'city': locationData.city.name, 'country': locationData.country.name};
    
  } else { 
    // fetches the user location data if not available in local storage 
    fetchUserCurrentLocation()
  }
}

function getLocationWeather (location) {
  // return weather data cached in browser local storage
  let weatherData = JSON.parse(localStorage.getItem('weatherInfo'));
  if ( weatherData ) {
    return weatherData
  } else {
    fetchWeatherData(location)
  }
}

function setLocation (location) {
  // saves/caches current user location data to browser local storage
 localStorage.setItem('location', location)
}

function setWeatherInfo (weatherData) {
  // save/cache current weather info to local storage
  localStorage.setItem('weatherInfo', weatherData )
}


function displayWeather (weatherData) {

}

currentLocation = getCurrentLocation()
weatherInfo = getLocationWeather(currentLocation)


console.log("Current Location Info: ", currentLocation);
console.log('Weather Info: ', weatherInfo);