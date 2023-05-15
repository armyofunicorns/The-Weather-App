/* Created by Anthony Hall */
/* Updated on April 2, 2023 */

/* Clear local storage */
// localStorage.clear();

/* Define global vars */
let apiKey = "95b40b7251d7c4d04d5bc72b6c0d970e";
let count = 0;
let currentTime; 
let currentTemp; 
let currentFeelsLike;
let currentPressure;
let currentHumidity;
let currentUVIndex;
let currentClouds;
let currentWindSpeed;
let currentWindDegrees;
let currentWeatherIcon;
let currentWeatherIconURL;

const dailyTime = [];
const dailyTempDay = [];
const dailyTempMax = [];
const dailyTempMin = [];
const dailySunrise = [];
const dailySunset =  [];
const dailyMoonRise = [];
const dailyMoonSet = [];
const dailyMoonPhase = [];
const dailyHumidity = [];
const dailyWindSpeed = [];
const dailyWindDegrees = [];
const dailyWeatherIcon = [];
const dailyClouds = [];
const dailyPOP = [];
const dailyUVI = [];
const displayCity = [];
const displayState = [];
const displayLat = [];
const displayLon = []; 

let cityFormEl = document.querySelector("#city-form");
let nameInputEl = document.querySelector("#cityName");
let weatherContainerEl = document.querySelector("#weather-container");
let citySearchTerm = document.querySelector("#city-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var cityName = nameInputEl.value.trim();

    if (cityName) {
        lookUpCity(cityName);
        nameInputEl.value = "";
    } else {
        alert("Please enter a US city name.");
    }
};

var lookUpCity = function(location) {
    
    // Format the API URL
    var cityAPIValue = location+",,US";
    var geoAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityAPIValue+"&limit=50&appid="+apiKey;
    console.log(geoAPIUrl);

    fetch(geoAPIUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(geoData) {
                    // Identify the length of geoData array
                    console.log(geoData);
                    if (geoData.length > 1) {
                        selectWhichCity(geoData);
                    } else {
                        var locationName = geoData[0].name;
                        var latValue = geoData[0].lat;
                        var lonValue = geoData[0].lon;
                        getCityWeather(locationName, latValue, lonValue);
                    }
                });
            } else  {
                alert("Error: City could not be found.");
            };
        })
        .catch(function(error) {
            alert("Error: Hit the catch. City cound not be found.");
        });
};

// Ask the user which city they want to get weather for
var selectWhichCity = function(location) {
    console.log(location);
    var sizeArray = location.length;
    console.log(sizeArray);

    // Clear old content just in case
    weatherContainerEl.textContent = "";

    for (let t = 0; t < sizeArray; t++) {
        // Display the list of Cities
        displayCity[t] = location[t].name;
        displayState[t] = location[t].state;
        displayLat[t] = location[t].lat;
        displayLon[t] = location[t].lon;

        /* Display results */
        // create a container for each day of the week
        var cityEl = document.createElement("a");
        cityEl.classList = "list-item flex-row justify-space-between align-center";
        cityEl.setAttribute("href", "#");
        cityEl.onclick = function() { getCityWeather(displayCity[t], displayLat[t], displayLon[t]); };

        // create a span element to hold city name
        var titleEl = document.createElement("span");
        titleEl.textContent = displayCity[t] + ", " + displayState[t];

        // append to container
        cityEl.appendChild(titleEl);

        // append container to the dom
        weatherContainerEl.appendChild(cityEl);
    };

    
    
}

// Get All the weatherData By location
var getCityWeather = function(location, latValue, lonValue) {

    // format the WeatherData API URL
    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+latValue+"&lon="+lonValue+"&appid="+apiKey+"&units=imperial&exclude=hourly,minutely";
     
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    pullWeather(data, location);
                    saveToStorage(location);
                });
            } else {
                alert("Error: City could not be found.");
            };
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Error: Hit the catch. City cound not be found.");
        });
};

var saveToStorage = function(queryLocation) {
    // Check if LocalStorage is empty
    if (localStorage.getItem("searchObject") === null) {
        // Create a new object
        var searchObject = {
            searchLocation0: queryLocation
        }
    
        // Add the object in LocalStorage
        localStorage.setItem("searchObject", JSON.stringify(searchObject));
    } else {
        // LocalStorage is not empty
        // Grab all the info in the object
        var existing = localStorage.getItem("searchObject");
        existing = existing ? JSON.parse(existing) : {};
        existing['searchLocation'+count] = queryLocation;

        // Update the request
        localStorage.setItem('searchObject', JSON.stringify(existing));
    };
    count++;
}

var pullWeather = function(weatherData, searchTerm) {
    // Check and verify if API returned any weatherData
    var size = Object.keys(weatherData).length;
    if (size === 0) {
        weatherContainerEl.textContent = "No city by that name found. Please try again.";
        return;
    }
    // Clear old content just in case
    weatherContainerEl.textContent = "";
    citySearchTerm.textContent = searchTerm; 

    /* Grab current data from API */
    currentTime = weatherData.current.dt;
    currentTemp = weatherData.current.temp;
    currentFeelsLike = weatherData.current.feels_like;
    currentPressure = weatherData.current.pressure;
    currentHumidity = weatherData.current.humidity;
    currentUVIndex = weatherData.current.uvi;
    getUVIndexVale(currentUVIndex, "currentUVIndex");
    currentClouds = weatherData.current.clouds;
    currentWindSpeed = weatherData.current.wind_speed;
    currentWindDegrees = weatherData.current.wind_deg;
    currentWeatherIcon = weatherData.current.weather[0].icon;
    currentWeatherIconURL = "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@4x.png";

    // loop over weatherData
    for (let i = 0; i < size + 1; i++) {
        /* Grab all daily data and store in arrays */
        dailyTime[i] = weatherData.daily[i].dt;
        convertUTC(dailyTime[i], i);
        
        dailyTempDay[i] = weatherData.daily[i].temp.day;
        
        let dailyTempMaxBF = weatherData.daily[i].temp.max;
        dailyTempMax[i] = Math.trunc(dailyTempMaxBF);
        
        let dailyTempMinBF = weatherData.daily[i].temp.min;
        dailyTempMin[i] = Math.trunc(dailyTempMinBF);

        dailySunrise[i] = weatherData.daily[i].sunrise;
        dailySunset[i] = weatherData.daily[i].sunset;
        dailyMoonRise[i] = weatherData.daily[i].moonrise;
        dailyMoonSet[i] = weatherData.daily[i].moonset;
        dailyMoonPhase[i] = weatherData.daily[i].moon_phase;
        dailyHumidity[i] = weatherData.daily[i].humidity;
        dailyWindSpeed[i] = weatherData.daily[i].wind_speed;
        dailyWindDegrees[i] = weatherData.daily[i].wind_deg;
        dailyWeatherIcon[i] = weatherData.daily[i].weather[0].icon;
        let dailyWeatherIconURL = "https://openweathermap.org/img/wn/" + dailyWeatherIcon[i] + "@4x.png";
        dailyClouds[i] = weatherData.daily[i].clouds;
        dailyPOP[i] = weatherData.daily[i].pop;
        dailyUVI[i] = weatherData.daily[i].uvi;
        // Determine the UVIndex value
        getUVIndexVale(dailyUVI[i], "dailyUVI[" + i + "]");

        /* Now update the UI */
        displayWeather(i);
    };
};

var displayWeather = function(z) {
    /* Display results */
    // create a container for each day of the week
    var cityEl = document.createElement("a");
    cityEl.classList = "list-item flex-row justify-space-between align-center";
    cityEl.setAttribute("href", "./daily.html?city=" + cityName);

    // create a span element to hold city name
    var titleEl = document.createElement("span");
    titleEl.textContent = dailyTempMax[z] + "/" + dailyTempMin[z];

    // append to container
    cityEl.appendChild(titleEl);

    // append container to the dom
    weatherContainerEl.appendChild(cityEl);
};

function getUVIndexVale(valueUVI, whatUVIVarName) {
    if (valueUVI <= 2) {
        // value is favorable

    } else if ((valueUVI > 2) && (valueUVI <= 7)) {
        // value is moderate

    } else {
        // value is severe

    }
    return;
};

function getCurrentTime() {
    /* Get the current time */
    // let currentTimeAWH = Math.floor(new Date().getTime()/1000.0);
    // console.log("current time = " + currentTimeAWH);
};

function convertUTC(utcSeconds, counter) {
    console.log("date = " + counter + " " + utcSeconds);

    /* Convert utcSeconds to a Date */
    var dtDate = new Date(0);
    dtDate.setUTCSeconds(utcSeconds);
    console.log("converted time = " + dtDate);

    /* Convert Date to a string */
    var dtDateString = String(dtDate);

    /* Parse the day of the week, month, day, year */
    // Thu Apr 06 2023 13:00:00 GMT-0700 (Pacific Daylight Time)
    var splitDateArray = dtDateString.split(" ");
    
    // var text = "How are you doing today?";
    // var myArray = text.split(" ");
    console.log(splitDateArray);

    return;
    
};

// Get repos by language
var getFeaturedRepos = function(language) {
    // Construct the API URL var
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    
    console.log(apiUrl);
    console.log(language);
    
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeather(data.items, language);
            });
        } else {
            alert('Error: City was not found.');
        }
    });
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    console.log("current language = " + language);
    if (language) {
        getFeaturedRepos(language);
      
        // clear old content
        weatherContainerEl.textContent = "";
      }
};


cityFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);