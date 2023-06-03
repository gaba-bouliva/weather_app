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
let temperatureUnit = 'c' // c for celsius f for fahrenheit

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
    
    if (data.hasOwnProperty('error')) {
      throw(error)
    }else{
      setWeatherInfo(JSON.stringify(data));
    }
  } catch (error) {
    throw(error);
  }
}

function getCurrentLocation () {
  // return user location data cached in browser local storage
  let locationData = JSON.parse(localStorage.getItem('location'));
  if ( locationData.hasOwnProperty('city') && locationData.hasOwnProperty('country')) {
    
    return {'city': locationData.city.name, 'country': locationData.country.name};
    //return {'city': 'Milan', 'country': 'Italy'};
    
  } else { 
    // fetches the user location data if not available in local storage 
    fetchUserCurrentLocation()
  }
}

function getLocationWeather (location) {
  // return weather data cached in browser local storage
  let weatherData = JSON.parse(localStorage.getItem('weatherInfo'));
  if ( weatherData && 
    weatherData.location.name === currentLocation.city &&
    weatherData.location.country === currentLocation.country
         ) {
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
  let currentWeatherImg = document.querySelector('.current-weather-icon');
  let currentTemperatureH1 = document.querySelector('.current-temp');
  let weatherDescriptionH2 = document.querySelector('.weather-description');
  let todayDateP = document.querySelector('.today-date');
  let citySpan = document.querySelector('.city');

  let currentDateArr = Date().split(' ');
  let dayOfMonth = currentDateArr[2];
  let month = currentDateArr[1];
  let dayOfWeek = currentDateArr[0];

  //currentWeatherImg.setAttribute('src', `${weatherData.current.condition.icon}`);
  let weatherImgSrc = {'rain': 'HeavyRain.png', 'cloud': 'HeavyCloud.png', 'sun': 'Clear.png', 'sunny': 'Clear.png', 'rainy': 'HeavyRain.png', 'snow': 'Snow.png'}

  let weatherDescArr = weatherData.current.condition.text.toLocaleLowerCase().split(' ');

  for (let i = 0; i < weatherDescArr.length; i++) {
    const word = weatherDescArr[i];
    if (weatherImgSrc[word]) {
      currentWeatherImg.setAttribute('src', `images/${weatherImgSrc[word]}`);
      break;
    }
  }

  if ( temperatureUnit === 'f') {

    currentTemperatureH1.innerHTML  = `${ parseInt(weatherData.current.temp_f)}
                                      <span class="temp-unit">&deg;F</span>`
  } else {
    currentTemperatureH1.innerHTML  = `${ parseInt(weatherData.current.temp_c)}
                                      <span class="temp-unit">&deg;C</span>`
  }

  weatherDescriptionH2.innerText = `${weatherData.current.condition.text}`
  todayDateP.innerText = `Today. ${dayOfWeek}, ${dayOfMonth} ${month}`;
  citySpan.innerText = `${weatherData.location.name}`
}

currentLocation = getCurrentLocation()

weatherInfo = getLocationWeather(currentLocation)

console.log("Current Location Info: ", currentLocation);
console.log('Weather Info: ', weatherInfo);

if (weatherInfo) {
  
  displayWeather(weatherInfo)
} else {
  throw('Weather Info undefined!')
}


