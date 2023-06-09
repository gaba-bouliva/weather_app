/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ (() => {

eval("const envVariables = {\"APP_TITLE\":\"Weather App\",\"APP_ENV\":\"development\",\"APP_WEATHER_API_KEY\":\"70d28bbd2ab54cda81a65429230106\",\"APP_WEATHER_API_ENDPOINT\":\"https://api.weatherapi.com/v1/forecast.json\",\"APP_IP_INFO_API_KEY\":\"066257437a57453bb2c12f43c7992ec4\",\"APP_IP_INFO_ENDPOINT\":\"https://api.geoapify.com/v1/ipinfo\"};\nlet currentUsrLocation = null;\nlet weatherInfo = null;\nlet temperatureUnit = 'c'; // c for celsius f for fahrenheit\nlet forecastNbrDays = 6;\nconst {\n  APP_TITLE,\n  APP_ENV,\n  APP_WEATHER_API_KEY,\n  APP_WEATHER_API_ENDPOINT,\n  APP_IP_INFO_API_KEY,\n  APP_IP_INFO_ENDPOINT\n} = envVariables;\nasync function fetchUserCurrentLocation() {\n  // retrieves user IP location data from api\n  try {\n    const response = await fetch(`${APP_IP_INFO_ENDPOINT}?apiKey=${APP_IP_INFO_API_KEY}`, {\n      mode: 'cors',\n      headers: {\n        'Content-Type': 'application/json'\n      }\n    });\n    const data = await response.json();\n    console.log('user location data: ', data);\n    if (data.hasOwnProperty('error')) {\n      throw data.error;\n    } else {\n      console.log('No error');\n      const location = {\n        'name': data.city.name,\n        'country': data.country.name,\n        'lat': data.location.latitude,\n        'lon': data.location.longitude\n      };\n      setLocation(JSON.stringify(location));\n      return location;\n    }\n  } catch (error) {\n    console.log(error);\n  }\n}\nfunction incrementDate(days) {\n  const today = new Date();\n  const futureDate = new Date(today);\n  futureDate.setDate(today.getDate() + days);\n  return futureDate.toString();\n}\nfunction formatDate(unformattedDate) {\n  let formattedDate = '';\n  let unformattedDateArr = unformattedDate.split(' ');\n  let dayOfMonth = unformattedDateArr[2];\n  let month = unformattedDateArr[1];\n  let dayOfWeek = unformattedDateArr[0];\n  formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;\n  return formattedDate;\n}\nasync function fetchWeatherForecast(location, nbrDays) {\n  // returns weather forecast for the  location and number of days provided\n  try {\n    const response = await fetch(`${APP_WEATHER_API_ENDPOINT}?q=${location}&key=${APP_WEATHER_API_KEY}&days=${nbrDays}&aqi=no&alerts=no`, {\n      mode: 'cors',\n      headers: {\n        'Content-Type': 'application/json'\n      }\n    });\n    const data = await response.json();\n    if (data.hasOwnProperty('error')) {\n      throw data.error;\n    } else {\n      console.log('Weather forecast info: ', data);\n      setWeatherForecastInfo(JSON.stringify(data), location);\n      return data;\n    }\n  } catch (error) {\n    throw error;\n  }\n}\nasync function getCurrentLocation() {\n  // return user location data cached in browser local storage\n  let locationData = JSON.parse(localStorage.getItem('location'));\n  if (locationData) {\n    console.log('locationData', locationData);\n    return locationData;\n  } else {\n    console.log('Fetching for user current location...');\n    return await fetchUserCurrentLocation();\n  }\n}\nasync function getLocationWeatherForecast(location, nbrDays) {\n  let weatherForecast = JSON.parse(localStorage.getItem(location));\n  if (weatherForecast) {\n    return weatherForecast;\n  } else {\n    return await fetchWeatherForecast(location, nbrDays);\n  }\n}\nfunction setLocation(location) {\n  // saves/caches current user location data to browser local storage\n  localStorage.setItem('location', location);\n  setTimeout(() => {\n    localStorage.removeItem('location');\n  }, 1800000); // after 30 mins current user location is removed from localStorage \n}\n\nfunction setWeatherForecastInfo(weatherForecastData, location) {\n  localStorage.setItem(location, weatherForecastData);\n  setTimeout(() => {\n    localStorage.removeItem(location);\n  }, 3600000); // after 3 hrs weatherForeCastData is removed from localStorage \n}\n\nfunction displayWeatherForecast(weatherForecasts) {\n  /**\n   * displays next x days weather forecast\n   */\n\n  if (weatherForecasts) {\n    let forecastDate = '';\n    for (let i = 0; i < weatherForecasts.length; i++) {\n      if (i === 0) {\n        // ignore first forecast (current day forecast)\n        continue;\n      }\n      forecastDate = formatDate(incrementDate(i));\n      const forecast = weatherForecasts[i];\n      let forecastDiv = document.querySelector(`.today-plus-${i}`);\n      forecastDiv.innerHTML = `\n       ${i === 1 ? `<h3>Tomorrow</h3>` : `<h3>${forecastDate}</h3>`}\n        \n        <div class=\"weather-icon\">\n          <img src=\"${forecast.day.condition.icon}\" class=\"${forecast.day.condition.text}\">\n        </div>\n        <p class=\"temp\">\n              <span class=\"min-temp\">\n                ${temperatureUnit === 'f' ? forecast.day.mintemp_f : forecast.day.mintemp_c} \n                ${temperatureUnit === 'f' ? \"<span class='temp-unit'><sup>&deg;</sup>F</span>\" : \"<span class='temp-unit'><sup>&deg;</sup>C</span> \"}\n              </span>\n              <span class=\"max-temp\">\n              ${temperatureUnit === 'f' ? forecast.day.maxtemp_f : forecast.day.maxtemp_c} \n              ${temperatureUnit === 'f' ? \"<span class='temp-unit'><sup>&deg;</sup>F</span>\" : \"<span class='temp-unit'><sup>&deg;</sup>C</span> \"} \n              </span>\n        </p>\n      `;\n    }\n  }\n}\nfunction displayCurrentWeatherHighlights(currentWeather) {\n  let windStatusP = document.querySelector('.wind-status');\n  let humidityP = document.querySelector('.humidity-status');\n  let humidityBarDiv = document.querySelector('.humidity-bar');\n  let visibilityP = document.querySelector('.visibility-status');\n  let airPressureP = document.querySelector('.air-pressure-status');\n  windStatusP.innerHTML = `${currentWeather.wind_mph}<span>mph</span>`;\n  humidityP.innerHTML = `${currentWeather.humidity}<span>%</span>`;\n  humidityBarDiv.style.backgroundImage = `linear-gradient(to right, yellow \n                                          ${currentWeather.humidity}%, rgba(0,0,0,0) \n                                          ${currentWeather.humidity}%)`;\n  visibilityP.innerHTML = `${currentWeather.vis_miles}<span>miles</span>`;\n  airPressureP.innerHTML = `${currentWeather.pressure_mb}<span>mb</span>`;\n}\nfunction displayCurrentLocationWeather(currentWeather, location) {\n  console.log('Location to display: ', location);\n  let currentWeatherImg = document.querySelector('.current-weather-icon');\n  let currentTemperatureH1 = document.querySelector('.current-temp');\n  let weatherDescriptionH2 = document.querySelector('.weather-description');\n  let todayDateP = document.querySelector('.today-date');\n  let citySpan = document.querySelector('.city');\n  let currentDate = formatDate(Date());\n  currentWeatherImg.setAttribute('src', `${currentWeather.condition.icon}`);\n  currentWeatherImg.setAttribute('alt', `${currentWeather.condition.text}`);\n  currentWeatherImg.style.width = '100px';\n  currentWeatherImg.style.zIndex = '1';\n  if (temperatureUnit === 'f') {\n    currentTemperatureH1.innerHTML = `${parseInt(currentWeather.temp_f)}\n                                      <span class=\"temp-unit\">&deg;F</span>`;\n  } else {\n    currentTemperatureH1.innerHTML = `${parseInt(currentWeather.temp_c)}\n                                      <span class=\"temp-unit\">&deg;C</span>`;\n  }\n  weatherDescriptionH2.innerText = `${currentWeather.condition.text}`;\n  todayDateP.innerText = `Today. ${currentDate}`;\n  citySpan.innerText = `${location}`;\n}\nfunction handleSearchLocation(e) {\n  let searchedLocation = document.querySelector('#location').value.toLowerCase().trim();\n  if (searchedLocation) {\n    searchedLocation = capitalizeString(searchedLocation);\n    console.log('currentLocation');\n    if (currentUsrLocation !== searchedLocation) {\n      getLocationWeatherForecast(searchedLocation, forecastNbrDays).then(searchedLocationWeather => {\n        console.log('New location weather forecast: ', searchedLocationWeather);\n        displayCurrentLocationWeather(searchedLocationWeather.current, searchedLocation);\n        displayWeatherForecast(searchedLocationWeather.forecast.forecastday);\n        displayCurrentWeatherHighlights(searchedLocationWeather.current);\n      });\n      let liveLocationBtn = document.querySelector('.live-location');\n      liveLocationBtn.style.backgroundColor = '#6E707A';\n      liveLocationBtn.style.color = '#E7E7EB';\n    }\n  }\n}\nfunction capitalizeString(strValue) {\n  console.log('String before capitalization: ', strValue);\n  let capitalizedArr = strValue.split('');\n  capitalizedArr[0] = capitalizedArr[0].toUpperCase();\n  let capitalizedStr = capitalizedArr.join('');\n  return capitalizedStr;\n}\nfunction setTempUnit(unit) {\n  if (temperatureUnit !== unit) {\n    temperatureUnit = unit;\n    main();\n  }\n}\nfunction main(e) {\n  if (e) {\n    // live location btn clicked \n\n    let liveLocationBtnEl = null;\n    let liveLocationTxtColor = '';\n    let liveLocationBgColor = '';\n    if (e.target.tagName === 'SPAN') {\n      // if span containing live location icon is clicked return parent el which is btn element \n      liveLocationBtnEl = e.target.parentNode;\n    } else if (e.target.tagName === 'BUTTON') {\n      liveLocationBtnEl = e.target;\n    }\n    liveLocationTxtColor = liveLocationBtnEl.style.color;\n    liveLocationBgColor = liveLocationBtnEl.style.backgroundColor;\n    if (liveLocationTxtColor === 'rgb(0, 0, 0)' && liveLocationBgColor === 'rgb(255, 255, 255)') {\n      // live location btn already active or clicked\n      return;\n    }\n  }\n  let liveLocationBtn = document.querySelector('.live-location');\n  liveLocationBtn.style.backgroundColor = '#fff';\n  liveLocationBtn.style.color = '#000';\n  liveLocationBtn.addEventListener('click', main);\n  let searchBtn = document.querySelector('.search-btn');\n  searchBtn.addEventListener('click', handleSearchLocation);\n  document.querySelector('#location').addEventListener('keypress', e => {\n    if (e.keyCode === 13) {\n      // Enter key pressed in search location input \n      searchBtn.click(); // handleSearchLocation called by clicking search button\n    }\n  });\n\n  let fahrenheitBtn = document.querySelector('.fahrenheit');\n  let celsiusBtn = document.querySelector('.celsius');\n  fahrenheitBtn.addEventListener('click', e => {\n    e.target.style.color = '#000';\n    e.target.style.backgroundColor = '#fff';\n    celsiusBtn.style.color = '#E7E7EB';\n    celsiusBtn.style.backgroundColor = '#6E707A';\n    setTempUnit('f');\n  });\n  celsiusBtn.addEventListener('click', e => {\n    e.target.style.color = '#000';\n    e.target.style.backgroundColor = '#fff';\n    fahrenheitBtn.style.color = '#E7E7EB';\n    fahrenheitBtn.style.backgroundColor = '#6E707A';\n    setTempUnit('c');\n  });\n  getCurrentLocation().then(currentLocation => {\n    if (!currentLocation.hasOwnProperty('name')) {\n      location.reload();\n    }\n    console.log('Current location', currentLocation);\n    currentUsrLocation = currentLocation.name;\n    getLocationWeatherForecast(currentLocation.name, forecastNbrDays).then(weatherInfo => {\n      console.log('weather in global object: ', weatherInfo);\n      if (weatherInfo) {\n        console.log('Weather Forecast Info: ', weatherInfo);\n        displayCurrentLocationWeather(weatherInfo.current, currentLocation.name);\n        displayWeatherForecast(weatherInfo.forecast.forecastday);\n        displayCurrentWeatherHighlights(weatherInfo.current);\n      } else {\n        throw 'Weather forecast info undefined!';\n      }\n    });\n  });\n}\nmain();\n\n//# sourceURL=webpack://weather_app/./src/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/app.js"]();
/******/ 	
/******/ })()
;