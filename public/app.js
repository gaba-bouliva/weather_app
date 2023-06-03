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

eval("/**\n * TODO\n * 1 get user current location\n * 2 get user current location weather fromm weather api\n * 3 populate various weather info on weather app\n * 4 populate corresponding weather icons base on weather\n * 4 implement search location city/country\n */\n\nconst envVariables = {\"APP_TITLE\":\"Weather App\",\"APP_ENV\":\"development\",\"APP_WEATHER_API_KEY\":\"70d28bbd2ab54cda81a65429230106\",\"APP_WEATHER_API_ENDPOINT\":\"https://api.weatherapi.com/v1/current.json\",\"APP_GIPHY_API_KEY\":\"SVEd7C3jeJMpEA5JAGM9XLryKUDyIW91\",\"APP_GIPHY_API_ENDPOINT\":\"https://api.giphy.com/v1/gifs/search\",\"APP_IP_INFO_API_KEY\":\"e70733cb3f954dd4b1adfb55f153f09c\",\"APP_IP_INFO_ENDPOINT\":\"https://api.geoapify.com/v1/ipinfo\"};\nlet currentLocation = null;\nlet weatherInfo = null;\nconst {\n  APP_TITLE,\n  APP_ENV,\n  APP_WEATHER_API_KEY,\n  APP_WEATHER_API_ENDPOINT,\n  APP_GIPHY_API_KEY,\n  APP_GIPHY_API_ENDPOINT,\n  APP_IP_INFO_API_KEY,\n  APP_IP_INFO_ENDPOINT\n} = envVariables;\nasync function fetchUserCurrentLocation() {\n  // retrieves user IP location data from api\n  try {\n    const response = await fetch(`${APP_IP_INFO_ENDPOINT}?apiKey=${APP_IP_INFO_API_KEY}`, {\n      mode: 'cors',\n      headers: {\n        'Content-Type': 'application/json'\n      }\n    });\n    const data = await response.json();\n    console.log('user location data: ', data);\n    if (data.hasOwnProperty('error')) {\n      throw error;\n    } else {\n      setLocation(JSON.stringify(data));\n    }\n  } catch (error) {\n    console.log(error);\n  }\n  getCurrentLocation();\n}\nasync function fetchWeatherData(location) {\n  // retrieves provided location weather info\n  console.log('weatherLocation: ', location);\n  try {\n    const response = await fetch(`${APP_WEATHER_API_ENDPOINT}?q=${location.city}&key=${APP_WEATHER_API_KEY}`, {\n      mode: 'cors',\n      headers: {\n        'Content-Type': 'application/json'\n      }\n    });\n    const data = await response.json();\n    console.log('location weather data: ', data);\n    if (data.hasOwnProperty('error')) {\n      throw error;\n    } else {\n      setWeatherInfo(JSON.stringify(data));\n    }\n  } catch (error) {\n    console.log(error);\n  }\n}\nfunction getCurrentLocation() {\n  // return user location data cached in browser local storage\n  let locationData = JSON.parse(localStorage.getItem('location'));\n  if (locationData.hasOwnProperty('city') && locationData.hasOwnProperty('country')) {\n    return {\n      'city': locationData.city.name,\n      'country': locationData.country.name\n    };\n  } else {\n    // fetches the user location data if not available in local storage \n    fetchUserCurrentLocation();\n  }\n}\nfunction getLocationWeather(location) {\n  // return weather data cached in browser local storage\n  let weatherData = JSON.parse(localStorage.getItem('weatherInfo'));\n  if (weatherData) {\n    return weatherData;\n  } else {\n    fetchWeatherData(location);\n  }\n}\nfunction setLocation(location) {\n  // saves/caches current user location data to browser local storage\n  localStorage.setItem('location', location);\n}\nfunction setWeatherInfo(weatherData) {\n  // save/cache current weather info to local storage\n  localStorage.setItem('weatherInfo', weatherData);\n}\nfunction displayWeather(weatherData) {}\ncurrentLocation = getCurrentLocation();\nweatherInfo = getLocationWeather(currentLocation);\nconsole.log(\"Current Location Info: \", currentLocation);\nconsole.log('Weather Info: ', weatherInfo);\n\n//# sourceURL=webpack://weather_app/./src/app.js?");

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