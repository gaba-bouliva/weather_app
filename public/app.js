(()=>{let e=null,t="c",o=6;const{APP_TITLE:n,APP_ENV:r,APP_WEATHER_API_KEY:a,APP_WEATHER_API_ENDPOINT:c,APP_IP_INFO_API_KEY:s,APP_IP_INFO_ENDPOINT:l}={APP_TITLE:"Weather App",APP_ENV:"production"};function i(e){const t=new Date,o=new Date(t);return o.setDate(t.getDate()+e),o.toString()}function u(e){let t="",o=e.split(" "),n=o[2],r=o[1];return t=`${o[0]}, ${n} ${r}`,t}async function d(e,t){return JSON.parse(localStorage.getItem(e))||await async function(e,t){try{const o=await fetch(`${c}?q=${e}&key=${a}&days=${t}&aqi=no&alerts=no`,{mode:"cors",headers:{"Content-Type":"application/json"}}),n=await o.json();if(n.hasOwnProperty("error"))throw n.error;return console.log("Weather forecast info: ",n),function(e,t){localStorage.setItem(t,e),setTimeout((()=>{localStorage.removeItem(t)}),36e5)}(JSON.stringify(n),e),n}catch(e){throw e}}(e,t)}function p(e){if(e){let o="";for(let n=0;n<e.length;n++){if(0===n)continue;o=u(i(n));const r=e[n];document.querySelector(`.today-plus-${n}`).innerHTML=`\n       ${1===n?"<h3>Tomorrow</h3>":`<h3>${o}</h3>`}\n        \n        <div class="weather-icon">\n          <img src="${r.day.condition.icon}" class="${r.day.condition.text}">\n        </div>\n        <p class="temp">\n              <span class="min-temp">\n                ${"f"===t?r.day.mintemp_f:r.day.mintemp_c} \n                ${"f"===t?"<span class='temp-unit'><sup>&deg;</sup>F</span>":"<span class='temp-unit'><sup>&deg;</sup>C</span> "}\n              </span>\n              <span class="max-temp">\n              ${"f"===t?r.day.maxtemp_f:r.day.maxtemp_c} \n              ${"f"===t?"<span class='temp-unit'><sup>&deg;</sup>F</span>":"<span class='temp-unit'><sup>&deg;</sup>C</span> "} \n              </span>\n        </p>\n      `}}}function m(e){let t=document.querySelector(".wind-status"),o=document.querySelector(".humidity-status"),n=document.querySelector(".humidity-bar"),r=document.querySelector(".visibility-status"),a=document.querySelector(".air-pressure-status");t.innerHTML=`${e.wind_mph}<span>mph</span>`,o.innerHTML=`${e.humidity}<span>%</span>`,n.style.backgroundImage=`linear-gradient(to right, yellow \n                                          ${e.humidity}%, rgba(0,0,0,0) \n                                          ${e.humidity}%)`,r.innerHTML=`${e.vis_miles}<span>miles</span>`,a.innerHTML=`${e.pressure_mb}<span>mb</span>`}function y(e,o){console.log("Location to display: ",o);let n=document.querySelector(".current-weather-icon"),r=document.querySelector(".current-temp"),a=document.querySelector(".weather-description"),c=document.querySelector(".today-date"),s=document.querySelector(".city"),l=u(Date());n.setAttribute("src",`${e.condition.icon}`),n.setAttribute("alt",`${e.condition.text}`),n.style.width="100px",n.style.zIndex="1",r.innerHTML="f"===t?`${parseInt(e.temp_f)}\n                                      <span class="temp-unit">&deg;F</span>`:`${parseInt(e.temp_c)}\n                                      <span class="temp-unit">&deg;C</span>`,a.innerText=`${e.condition.text}`,c.innerText=`Today. ${l}`,s.innerText=`${o}`}function g(t){let n=document.querySelector("#location").value.toLowerCase().trim();if(n&&(n=function(e){console.log("String before capitalization: ",e);let t=e.split("");return t[0]=t[0].toUpperCase(),t.join("")}(n),console.log("currentLocation"),e!==n)){d(n,o).then((e=>{console.log("New location weather forecast: ",e),y(e.current,n),p(e.forecast.forecastday),m(e.current)}));let e=document.querySelector(".live-location");e.style.backgroundColor="#6E707A",e.style.color="#E7E7EB"}}function f(e){t!==e&&(t=e,h())}function h(t){if(t){let e=null,o="",n="";if("SPAN"===t.target.tagName?e=t.target.parentNode:"BUTTON"===t.target.tagName&&(e=t.target),o=e.style.color,n=e.style.backgroundColor,"rgb(0, 0, 0)"===o&&"rgb(255, 255, 255)"===n)return}let n=document.querySelector(".live-location");n.style.backgroundColor="#fff",n.style.color="#000",n.addEventListener("click",h);let r=document.querySelector(".search-btn");r.addEventListener("click",g),document.querySelector("#location").addEventListener("keypress",(e=>{13===e.keyCode&&r.click()}));let a=document.querySelector(".fahrenheit"),c=document.querySelector(".celsius");a.addEventListener("click",(e=>{e.target.style.color="#000",e.target.style.backgroundColor="#fff",c.style.color="#E7E7EB",c.style.backgroundColor="#6E707A",f("f")})),c.addEventListener("click",(e=>{e.target.style.color="#000",e.target.style.backgroundColor="#fff",a.style.color="#E7E7EB",a.style.backgroundColor="#6E707A",f("c")})),async function(){let e=JSON.parse(localStorage.getItem("location"));return e?(console.log("locationData",e),e):(console.log("Fetching for user current location..."),await async function(){try{const e=await fetch(`${l}?apiKey=${s}`,{mode:"cors",headers:{"Content-Type":"application/json"}}),t=await e.json();if(console.log("user location data: ",t),t.hasOwnProperty("error"))throw t.error;{console.log("No error");const e={name:t.city.name,country:t.country.name,lat:t.location.latitude,lon:t.location.longitude};return function(e){localStorage.setItem("location",e),setTimeout((()=>{localStorage.removeItem("location")}),18e5)}(JSON.stringify(e)),e}}catch(e){console.log(e)}}())}().then((t=>{e="",e=t.hasOwnProperty("name")?t.name:t.city.name,d(t.name,o).then((e=>{if(console.log("weather in global object: ",e),!e)throw"Weather forecast info undefined!";console.log("Weather Forecast Info: ",e),y(e.current,t.name),p(e.forecast.forecastday),m(e.current)}))})).catch((e=>{throw e}))}console.log("process.env",{APP_TITLE:"Weather App",APP_ENV:"production"}),console.log("APP_TITLE: ",n),console.log("APP_WEATHER_API_ENDPOINT",c),console.log("APP_IP_INFO_API_KEY,",s),h()})();