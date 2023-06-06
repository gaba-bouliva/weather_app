const envVariables = process.env;
let currentLocation = null;
let weatherInfo = null;
let temperatureUnit = 'c' // c for celsius f for fahrenheit

const {
  APP_TITLE,
  APP_ENV,
  APP_WEATHER_API_KEY,
  APP_WEATHER_API_ENDPOINT,
  APP_IP_INFO_API_KEY,
  APP_IP_INFO_ENDPOINT,
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


async function fetchWeatherForecast(location, nbrDays) {
  // returns weather forecast for the  location and number of days provided
  try {

    const response = await fetch(`${APP_WEATHER_API_ENDPOINT}?q=${location.city}&key=${APP_WEATHER_API_KEY}&days=${nbrDays}&aqi=no&alerts=no`, {
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    
    if (data.hasOwnProperty('error')) {
      throw(error)
    }else{
      console.log('Weather forecast info: ', data);
      setWeatherForecastInfo(JSON.stringify(data));
    }
    
  } catch (error) {
    throw(error);
  }
}

function getCurrentLocation () {
  // return user location data cached in browser local storage
  let locationData = JSON.parse(localStorage.getItem('location'));
  if ( locationData && locationData.hasOwnProperty('city') && locationData.hasOwnProperty('country')) {
    
    return {'city': locationData.city.name, 'country': locationData.country.name};
    //return {'city': 'Milan', 'country': 'Italy'};
    
  } else { 
    
    fetchUserCurrentLocation()
  }
}

function getLocationWeatherForecast(location, nbrDays) {
  let weatherForecast = JSON.parse(localStorage.getItem('weatherInfo'));
  if ( weatherForecast ) {
    return weatherForecast;
  } else {
    fetchWeatherForecast(location, nbrDays);
  }
}

function setLocation (location) {
  // saves/caches current user location data to browser local storage
 localStorage.setItem('location', location);
}

function setWeatherForecastInfo (weatherForecastData) {
  
  localStorage.setItem('weatherInfo', weatherForecastData);
}

function displayWeatherForecast (weatherForecasts) {
  /**
   * displays next x days weather forecast
   */
  for (let i = 0; i < weatherForecasts.length; i++) {

    if (i === 0) {
      // ignore first forecast (current day forecast)
      continue;
    }
    const forecast = weatherForecasts[i];

    let forecastDiv = document.querySelector(`.today-plus-${i}`);

    forecastDiv.innerHTML = `
      <h3>${forecast.date}</h3>
      <div class="weather-icon">
        <img src="${forecast.day.condition.icon}" class="${forecast.day.condition.text}">
      </div>
      <p class="temp">
            <span class="min-temp">
              ${ temperatureUnit === 'f' ? forecast.day.mintemp_f : forecast.day.mintemp_c } 
              ${ temperatureUnit === 'f' ? "<span class='temp-unit'><sup>&deg;</sup>F</span>" : "<span class='temp-unit'><sup>&deg;</sup>C</span> " }
            </span>
            <span class="max-temp">
            ${ temperatureUnit === 'f' ? forecast.day.maxtemp_f : forecast.day.maxtemp_c } 
            ${ temperatureUnit === 'f' ? "<span class='temp-unit'><sup>&deg;</sup>F</span>" : "<span class='temp-unit'><sup>&deg;</sup>C</span> " } 
            </span>
      </p>
    `
    
  }
}


function displayCurrentWeatherHighlights(currentWeather) {
  let windStatusP = document.querySelector('.wind-status');
  let humidityP = document.querySelector('.humidity-status');
  let humidityBarDiv = document.querySelector('.humidity-bar') 
  let visibilityP = document.querySelector('.visibility-status');
  let airPressureP = document.querySelector('.air-pressure-status');

  windStatusP.innerHTML = `${currentWeather.wind_mph}<span>mph</span>`;
  humidityP.innerHTML = `${currentWeather.humidity}<span>%</span>`;

  humidityBarDiv.style.backgroundImage = `linear-gradient(to right, yellow 
                                          ${currentWeather.humidity}%, rgba(0,0,0,0) 
                                          ${currentWeather.humidity}%)`

  visibilityP.innerHTML =  `${currentWeather.vis_miles}<span>miles</span>`;
  airPressureP.innerHTML = `${currentWeather.pressure_mb}<span>mb</span>`;
  

  
}

function displayCurrentLocationWeather (currentWeather, location) {
  let currentWeatherImg = document.querySelector('.current-weather-icon');
  let currentTemperatureH1 = document.querySelector('.current-temp');
  let weatherDescriptionH2 = document.querySelector('.weather-description');
  let todayDateP = document.querySelector('.today-date');
  let citySpan = document.querySelector('.city');

  let currentDateArr = Date().split(' ');
  let dayOfMonth = currentDateArr[2];
  let month = currentDateArr[1];
  let dayOfWeek = currentDateArr[0];

  currentWeatherImg.setAttribute('src', `${currentWeather.condition.icon}`);
  currentWeatherImg.setAttribute('alt', `${currentWeather.condition.text}`);
  currentWeatherImg.style.width = '100px';
  currentWeatherImg.style.zIndex = '1';

  if ( temperatureUnit === 'f') {

    currentTemperatureH1.innerHTML  = `${ parseInt(currentWeather.temp_f)}
                                      <span class="temp-unit">&deg;F</span>`
  } else {
    currentTemperatureH1.innerHTML  = `${ parseInt(currentWeather.temp_c)}
                                      <span class="temp-unit">&deg;C</span>`
  }

  weatherDescriptionH2.innerText = `${currentWeather.condition.text}`
  todayDateP.innerText = `Today. ${dayOfWeek}, ${dayOfMonth} ${month}`;
  citySpan.innerText = `${location.city}`
}

currentLocation = getCurrentLocation()

if (currentLocation) {
  console.log("Current Location Info: ", currentLocation);
  weatherInfo = getLocationWeatherForecast(currentLocation, 6);

} else {
  throw('Unknown current location!')
}

if (weatherInfo) {
  console.log('Weather Forecast Info: ', weatherInfo);
  displayCurrentLocationWeather(weatherInfo.current, currentLocation);
  displayWeatherForecast(weatherInfo.forecast.forecastday);
  displayCurrentWeatherHighlights(weatherInfo.current);
} else {
  throw('Weather forecast info undefined!');
}