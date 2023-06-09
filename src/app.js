const envVariables = process.env;
let currentUsrLocation = null;
let weatherInfo = null;
let temperatureUnit = 'c' // c for celsius f for fahrenheit
let forecastNbrDays = 6;

const {
  APP_TITLE,
  APP_ENV,
  APP_WEATHER_API_KEY,
  APP_WEATHER_API_ENDPOINT,
  APP_IP_INFO_API_KEY,
  APP_IP_INFO_ENDPOINT,
}  = envVariables;

console.log('process.env -> ', process.env);

async function fetchUserCurrentLocation() {
  // retrieves user IP location data from api
  let apiURL = `/.netlify/functions/getCurrentLocation`;
  console.log("location api url: ", apiURL);
  try {
    const response = await fetch(`${apiURL}`, {
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    
    console.log('user location data: ', data);
    if (data.hasOwnProperty('error')) {
      throw(data.error)
    }else{
      console.log('No error location value: ', data);
      setLocation(JSON.stringify(data));
      return data
    }
  } catch (error) {
    console.log(error);
  }

}

function incrementDate(days) {

  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + days)
 
  return futureDate.toString();
}

function formatDate(unformattedDate) {
  
  let formattedDate = '';

  let unformattedDateArr = unformattedDate.split(' ');
  let dayOfMonth = unformattedDateArr[2];
  let month = unformattedDateArr[1];
  let dayOfWeek = unformattedDateArr[0];

  formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;
 
  return formattedDate;
}


async function fetchWeatherForecast(location, nbrDays) {
  // returns weather forecast for the  location and number of days provided

  let weatherForecastApiURL = `/.netlify/functions/getWeatherForecast?location=${location}&nbrDays=${nbrDays}`;

  console.log('weatherForecastAPIURL: ', weatherForecastApiURL);
  try {
    
    console.log('location in fetchWeatherForecast: ', location);
    const response = await fetch(`${weatherForecastApiURL}`,
    {
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
      }
    })
    console.log('Response: ', response);
    const data = await response.json();
    
    if (data.hasOwnProperty('error')) {
      console.log('data has error: ', error);
      throw(data.error)
    }else{
      console.log('Weather forecast info: ', data);
      setWeatherForecastInfo(JSON.stringify(data), location);
      return data
    }
    
  } catch (error) {
    console.log('Error fetching weather forecast: ', error);
    throw(error);
  }
}

async function getCurrentLocation() {
  // return user location data cached in browser local storage
  let locationData = JSON.parse(localStorage.getItem('location'));
  if (locationData ) {
    
    console.log('locationData', locationData);
    return locationData;
    
  } else {   

    console.log('Fetching for user current location...');
    return await fetchUserCurrentLocation();

  }

}

 async function getLocationWeatherForecast(location, nbrDays) {
  console.log(('location in getLocationWEather: ', location));
  let weatherForecast = JSON.parse(localStorage.getItem(location));
  if ( weatherForecast ) {
    return weatherForecast;
  } else {
    
    return await fetchWeatherForecast(location, nbrDays);
  }
}

function setLocation (location) {
  // saves/caches current user location data to browser local storage
 localStorage.setItem('location', location);
 setTimeout(() => {
  localStorage.removeItem('location');
 }, 1800000); // after 30 mins current user location is removed from localStorage 
}

function setWeatherForecastInfo (weatherForecastData, location) {
  localStorage.setItem(location, weatherForecastData);
  setTimeout(() => {
    localStorage.removeItem(location)
   }, 3600000); // after 3 hrs weatherForeCastData is removed from localStorage 

}


function displayWeatherForecast (weatherForecasts) {
  /**
   * displays next x days weather forecast
   */

  if (weatherForecasts) {
    let forecastDate = '';
    for (let i = 0; i < weatherForecasts.length; i++) {
      
      if (i === 0) {
        // ignore first forecast (current day forecast)
        continue;
      }
      
      forecastDate = formatDate(incrementDate(i)); 
      const forecast = weatherForecasts[i];
      let forecastDiv = document.querySelector(`.today-plus-${i}`);
      
      forecastDiv.innerHTML = `
       ${ i === 1 ? `<h3>Tomorrow</h3>` : `<h3>${forecastDate}</h3>`}
        
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
      forecastDiv.style.display = 'flex'; // display forecast div
    }
    
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
  console.log('Location to display: ', location);
  let currentWeatherImg = document.querySelector('.current-weather-icon');
  let currentTemperatureH1 = document.querySelector('.current-temp');
  let weatherDescriptionH2 = document.querySelector('.weather-description');
  let todayDateP = document.querySelector('.today-date');
  let citySpan = document.querySelector('.city');
  let currentDate = formatDate(Date())
 

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
  todayDateP.innerText = `Today. ${currentDate}`;
  citySpan.innerText = `${location}`
}


 function handleSearchLocation(e) {
  let searchedLocation = document.querySelector('#location').value.toLowerCase().trim();
  if (searchedLocation) {
    searchedLocation = capitalizeString(searchedLocation);
    console.log('currentLocation', );
    if (currentUsrLocation !== searchedLocation) {
      getLocationWeatherForecast(searchedLocation, forecastNbrDays).then( (searchedLocationWeather) => {
        console.log('New location weather forecast: ', searchedLocationWeather);
        displayCurrentLocationWeather(searchedLocationWeather.current, searchedLocation);
        displayWeatherForecast(searchedLocationWeather.forecast.forecastday);
        displayCurrentWeatherHighlights(searchedLocationWeather.current);
  
      })
      
      let liveLocationBtn = document.querySelector('.live-location');
      liveLocationBtn.style.backgroundColor = '#6E707A';
      liveLocationBtn.style.color = '#E7E7EB';
    }

  }
}

function capitalizeString(strValue) {
  console.log('String before capitalization: ', strValue);
  let capitalizedArr = strValue.split('');
  capitalizedArr[0] = capitalizedArr[0].toUpperCase();
  let capitalizedStr = capitalizedArr.join('');
  return capitalizedStr;
}

function setTempUnit(unit) {
  if (temperatureUnit !== unit) {
    temperatureUnit = unit;
    main();
  }
}


function main(e) {

  if (e) {
    // live location btn clicked 

    let liveLocationBtnEl = null;
    let liveLocationTxtColor = '';
    let liveLocationBgColor = '';

    if (e.target.tagName === 'SPAN') {
      // if span containing live location icon is clicked return parent el which is btn element 
      liveLocationBtnEl = e.target.parentNode; 
    } else if (e.target.tagName === 'BUTTON') {
      liveLocationBtnEl = e.target;
    }

    liveLocationTxtColor = liveLocationBtnEl.style.color;
    liveLocationBgColor = liveLocationBtnEl.style.backgroundColor;
  
    if (liveLocationTxtColor === 'rgb(0, 0, 0)' && liveLocationBgColor === 'rgb(255, 255, 255)' ) {
      // live location btn already active or clicked
      return
    }
  
  }

  let liveLocationBtn = document.querySelector('.live-location');
  liveLocationBtn.style.backgroundColor = '#fff';
  liveLocationBtn.style.color = '#000';
  liveLocationBtn.addEventListener('click', main);


  let searchBtn = document.querySelector('.search-btn');
  searchBtn.addEventListener('click', handleSearchLocation);

  document.querySelector('#location').addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
      // Enter key pressed in search location input 
      searchBtn.click(); // handleSearchLocation called by clicking search button
    }
  })
 

  let fahrenheitBtn = document.querySelector('.fahrenheit');
  let celsiusBtn = document.querySelector('.celsius');


  fahrenheitBtn.addEventListener('click', (e) => {
    e.target.style.color = '#000';
    e.target.style.backgroundColor = '#fff';

    celsiusBtn.style.color = '#E7E7EB';
    celsiusBtn.style.backgroundColor = '#6E707A';

    setTempUnit('f');
  });

  celsiusBtn.addEventListener('click', (e) => {
    e.target.style.color = '#000';
    e.target.style.backgroundColor = '#fff';

    fahrenheitBtn.style.color = '#E7E7EB';
    fahrenheitBtn.style.backgroundColor = '#6E707A';

    setTempUnit('c');
  })

  getCurrentLocation().then( (currentLocation) => {
    // userLocation from localStorage uses property name to return location string
    // userLocation from API uses city.name to return location string
    currentUsrLocation = '';
    console.log('currentLocation: ', currentLocation);
     
    if (currentLocation.hasOwnProperty('name')) {

      currentUsrLocation = currentLocation.name
      
    } else if (currentLocation.hasOwnProperty('city')) { 

      currentUsrLocation = currentLocation.city.name;
    } else {
      console.log('Invalid current location', currentLocation);
      throw("Invalid current location: ", currentLocation)
    }

    getLocationWeatherForecast(currentLocation.name, forecastNbrDays).then( (weatherInfo) => {
      console.log('weather in global object: ', weatherInfo);
      if (weatherInfo) {
        console.log('Weather Forecast Info: ', weatherInfo);
        displayCurrentLocationWeather(weatherInfo.current, currentLocation.name);
        displayWeatherForecast(weatherInfo.forecast.forecastday);
        displayCurrentWeatherHighlights(weatherInfo.current);
      } else {
        console.log('Weather forecast info undefined!');
        throw('Weather forecast info undefined!');
      }
    })
  }).catch((error) => {
    console.log("error: ", error);
    throw("Error getting location weather forecast: ", error)
  })

}

main()