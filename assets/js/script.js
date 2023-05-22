/* Created by Anthony Hall */
/* Updated on May 19, 2023 */

// Establish day or night
let currentTimeofDay = new Date();
let currentTimeInTheDay = currentTimeofDay.getHours();

if (currentTimeInTheDay >= 19) {
    var nightOrDay = "Night";
} else if (currentTimeInTheDay < 6) {
    var nightOrDay = "Night";
} else {
    var nightOrDay = "Day";
}

// Establish a random number between 1 and 4
min = Math.ceil(1);
max = Math.floor(5);
let randomNumber = Math.floor(Math.random() * (max - min) + min);

function changeColor(randomNumber,nightOrDay) {
    // Identify what we will be updating
    const backGradient = document.getElementById("anotherNamePerhaps");

    var correctClass = "flex-column min-100-vh" + " chooseBackground" + nightOrDay + randomNumber;
    backGradient.className = correctClass;
};

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
let currentWindSpeedWo;
let currentWindDegrees;
let currentWindDegreesWo;
let currentWeatherIcon;
let currentWeatherIconURL;
let diffFeelsLikeBooleanValue;

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

let cityForm = document.querySelector("#cityForm");
let nameInput = document.querySelector("#cityName"); // actual input value
let weatherContainer = document.querySelector("#weather-container");
let citySearchTerm = document.querySelector("#city-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");
let titleApp = document.querySelector(".app-title");
let subtitle = document.querySelector(".subtitle");
let citySearchNumber = document.querySelector("#city-search-number");
let singleLocationH1Desc = document.querySelector("#singleLocationH1Desc");
let singleLocationTemp = document.querySelector("#singleLocationTemp");
let singleLocationIcon = document.querySelector("#singleLocationIcon");
let selectCityContainer = document.querySelector("#selectCityContainer");
let currentConditionsContainer = document.getElementById("currentConditionsContainer");
let currentWeatherContainer = document.getElementById("currentWeatherContainer");

let statsFeelsLike = document.querySelector("#statsFeelsLike");
let statsHumidity = document.querySelector("#statsHumidity");
let statsPressure = document.querySelector("#statsPressure");
let statsUvIndex = document.querySelector("#statsUvIndex");
let statsWindSpeed = document.querySelector("#statsWindSpeed");
let statsWindDirection = document.querySelector("#statsWindDirection");

let statsFeelsLikeSub = document.querySelector("#statsFeelsLikeSub");
let statsHumiditySub = document.querySelector("#statsHumiditySub");
let statsPressureSub = document.querySelector("#statsPressureSub");
let statsUvIndexSub = document.querySelector("#statsUvIndexSub");
let statsWindSpeedSub = document.querySelector("#statsWindSpeedSub");
let statsWindDirectionSub = document.querySelector("#statsWindDirectionSub");

// Start here after form submit
var formSubmitStart = function(event) {
    event.preventDefault();
    
    // get value from input element
    var cityName = nameInput.value.trim();

    if (cityName) {
        lookUpCity(cityName);
        nameInput.value = "";
        slideSearch("false");
    } else {
        alert("Please enter a US city name.");
    }
};

// Utility function cleaning up title case of search query
function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
};

// Function to open/close the search field
function slideSearch(actionStatus) {
    if (actionStatus) {
        let nameInput = document.querySelector("#cityName");
        nameInput.classList.toggle('hidden');
        // nameInput.classList.add("hidden");
        // nameInput.style.width = ((nameInput.value.length + 1) * 8) + 'px';
    } else {
        return;
    };
};
  
var lookUpCity = function(location) {
    // Format the API URL
    var cityAPIValue = location+",,US";
    var geoAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityAPIValue+"&limit=50&appid="+apiKey;

    fetch(geoAPIUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(geoData) {
                    // Identify the length of geoData array
                    if (geoData.length > 1) {
                        selectWhichCity(geoData);
                        saveToStorage(location);
                        // Show the title
                        subtitle.style.display = "block";
                        // Change the app title
                        titleApp.textContent = "Which " + toTitleCase(location) + "?";
                        // Change the results definition
                        citySearchNumber.textContent = geoData.length;
                        // Change the search term
                        citySearchTerm.textContent = toTitleCase(location);
                    } else {
                        var locationName = geoData[0].name;
                        var latValue = geoData[0].lat;
                        var lonValue = geoData[0].lon;
                        getCityWeather(locationName, latValue, lonValue);
                        saveToStorage(location);
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
    // This function only fires when there are multiple locations
    
    var sizeArray = location.length;

    // Clear old content, just in case
    weatherContainer.textContent = "";

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
        weatherContainer.appendChild(cityEl);
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
        weatherContainer.textContent = "No city by that name found. Please try again.";
        return;
    }
    // Clear old content just in case
    weatherContainer.textContent = "";
    //citySearchTerm.textContent = searchTerm; 

    // First, let's update the heading...
    titleApp.textContent = "The weather in " + searchTerm + " is...";

    // Second, let's hide the subtitle (results text)
    subtitle.style.display = "none";

    selectCityContainer.style.display = "none";
    currentConditionsContainer.style.display = "flex";
    currentWeatherContainer.style.display = "flex";
    currentWeatherStatsContainer.style.display = "flex";

    // Third, close the search field
    //adjustWidth();

    /* Grab current data from API */
    currentTime = weatherData.current.dt;
    currentTemp = Math.round(weatherData.current.temp) + "°";
    currentFeelsLike = Math.round(weatherData.current.feels_like) + "°";
    currentPressure = weatherData.current.pressure + "hPA";
    currentHumidity = weatherData.current.humidity + "%";
    currentUVIndex = Math.round(weatherData.current.uvi * 10)/10;
    currentClouds = weatherData.current.clouds;
    currentWindSpeed = Math.round(weatherData.current.wind_speed) + "mph";
    currentWindSpeedWo = Math.round(weatherData.current.wind_speed);
    currentWindDegrees = weatherData.current.wind_deg + "°";
    currentWindDegreesWo = weatherData.current.wind_deg;
    currentWeatherMain = weatherData.current.weather[0].description;
    currentWeatherIcon = weatherData.current.weather[0].icon;
    currentWeatherIconURL = "/assets/images/" + currentWeatherIcon + "@4x.png";

    // Update the current description text
    singleLocationH1Desc.textContent = currentWeatherMain;
    // Need to validate that &deg; symbol used below works everywhere
    singleLocationTemp.textContent = currentTemp;

    // Update the current condition icon
    let newImage = currentWeatherIconURL;
    singleLocationIcon.src = newImage;
    singleLocationIcon.style.display = "block";

    // Update the stats data
    statsFeelsLike.textContent = currentFeelsLike;
    statsHumidity.textContent = currentHumidity;
    statsPressure.textContent = currentPressure;
    statsUvIndex.textContent = currentUVIndex;
    statsWindSpeed.textContent = currentWindSpeed;
    statsWindDirection.textContent = currentWindDegrees;

    // Determine the sub text for feels like value
    let diffFeelsLikeValue = Math.round(weatherData.current.temp) - Math.round(weatherData.current.feels_like);
    let diffFeelsLikeBoolean = Math.round(weatherData.current.temp) - Math.round(weatherData.current.feels_like);
    
    if (diffFeelsLikeBoolean > 0) {
        diffFeelsLikeBooleanValue = " cooler";
    } else if (diffFeelsLikeBoolean == 0) {
        diffFeelsLikeBooleanValue = " same";
    } else {
        diffFeelsLikeBooleanValue = " hotter";
    }
    
    // Determine the sub text for feels like
    getFeelsLike(diffFeelsLikeValue,diffFeelsLikeBooleanValue);
    
    // Determine the sub text for humidity
    getHumidity(weatherData.current.humidity);
    
    // Determine the sub text for pressure value
    getPressure(weatherData.current.pressure);
        
    // Determine the sub text for uv index value
    getUVIndexVale(currentUVIndex, "currentUVIndex");

    // Determine the sub text for wind speed value
    getWindSpeed(currentWindSpeedWo);   

    // Determine the sub text for wind direction value
    // Reminder: Wind is blowing FROM, not where it is blowing towards.
    getWindDirection(currentWindDegreesWo); 

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
        //displayWeather(i);
    };
};

function getFeelsLike(valueFeelsLike,valueHotCool) {
    if (valueFeelsLike == 0) {
        statsFeelsLikeSub.textContent = "same";
    } else if ((valueFeelsLike < 3) && (valueFeelsLike > 0)) {
        statsFeelsLikeSub.textContent = "similar";
    } else if ((valueFeelsLike < 6) && (valueFeelsLike >= 3)) {
        statsFeelsLikeSub.textContent = "slightly" + valueHotCool;
    } else if ((valueFeelsLike < 10) && (valueFeelsLike >= 6)) {
        statsFeelsLikeSub.textContent = "noticeably" + valueHotCool;
    } else if ((valueFeelsLike < 15) && (valueFeelsLike >= 10)) {
        statsFeelsLikeSub.textContent = "considerably" + valueHotCool;
    } else if ((valueFeelsLike < 20) && (valueFeelsLike >= 15)) {
        statsFeelsLikeSub.textContent = "much much" + valueHotCool;
    } else if (valueFeelsLike >= 20) {
        // greater than 20 degrees
        statsFeelsLikeSub.textContent = "hot and" + valueHotCool;
    } else {
        // when there is no data
        statsFeelsLikeSub.textContent = "no data";
    }
    return;
}

function getHumidity(valueHumidity) {
    if (valueHumidity == 0) {
        statsHumiditySub.textContent = "none";
    } else if ((valueHumidity < 30) && (valueHumidity > 0)) {
        statsHumiditySub.textContent = "low";
    } else if ((valueHumidity < 60) && (valueHumidity >= 30)) {
        statsHumiditySub.textContent = "moderate";
    } else if ((valueHumidity < 80) && (valueHumidity >= 60)) {
        statsHumiditySub.textContent = "high";
    } else if ((valueHumidity < 90) && (valueHumidity >= 80)) {
        statsHumiditySub.textContent = "very high";
    } else if (valueHumidity >= 90) {
        statsHumiditySub.textContent = "extremely high";
    }
    return;
};

function getPressure(valuePressure) {
    // Determine the sub text for pressure value
    if (valuePressure < 1000) {
        statsPressureSub.textContent = "low";
    } else if ((valuePressure >= 1000) && (valuePressure < 1013)) {
        statsPressureSub.textContent = "moderate";
    } else if ((valuePressure >= 1013) && (valuePressure < 1020)) {
        statsPressureSub.textContent = "high";
    } else if ((valuePressure >= 1020) && (valuePressure < 1030)) {
        statsPressureSub.textContent = "very high";
    } else {
        statsPressureSub.textContent = "extremely high";
    }
    return;
};

function getUVIndexVale(valueUVI, whatUVIVarName) {
    if (whatUVIVarName == "currentUVIndex") {
        if (valueUVI == 0) {
            // value is favorable
            statsUvIndexSub.textContent = "no worries";
        } else if (valueUVI <= 2) {
            // value is favorable
            statsUvIndexSub.textContent = "favorable";
        } else if ((valueUVI > 2) && (valueUVI <= 7)) {
            // value is moderate
            statsUvIndexSub.textContent = "moderate";
        } else if (valueUVI > 7) {
            // value is severe
            statsUvIndexSub.textContent = "severe";
        } else {
            statsUvIndexSub.textContent = "no data";
        }
        return;
    };
};

function getWindSpeed(valueSpeed) {
    if (valueSpeed == 0) {
        // value is none
        statsWindSpeedSub.textContent = "none";
    } else if ((valueSpeed > 0) && (valueSpeed <= 3)) {
        // value is calm
        statsWindSpeedSub.textContent = "calm";
    } else if ((valueSpeed > 3) && (valueSpeed <= 12)) {
        // value is light breeze
        statsWindSpeedSub.textContent = "light";
    } else if ((valueSpeed > 12) && (valueSpeed <= 24)) {
        // value is moderate breeze
        statsWindSpeedSub.textContent = "moderate";
    } else if ((valueSpeed > 24) && (valueSpeed <= 38)) {
        // value is fresh breeze
        statsWindSpeedSub.textContent = "fresh";
    } else if ((valueSpeed > 38) && (valueSpeed <= 55)) {
        // value is Strong breeze
        statsWindSpeedSub.textContent = "strong";
    } else if ((valueSpeed > 55) && (valueSpeed <= 73)) {
        // value is Gale-force breeze
        statsWindSpeedSub.textContent = "gale-force";
    } else if ((valueSpeed > 73) && (valueSpeed <= 95)) {
        // value is Storm-force breeze
        statsWindSpeedSub.textContent = "storm-force";
    } else if (valueSpeed > 95) {
        // value is Hurricane-force breeze
        statsWindSpeedSub.textContent = "hurricane-force";
    } else {
        // value is no value
        statsWindSpeedSub.textContent = "no data";
    }
    return;
};

function getWindDirection(valueDirection) {
    if ((valueDirection >= 0) && (valueDirection < 11.25)) {
        // value is north
        statsWindDirectionSub.textContent = "north";
    } else if ((valueDirection >= 11.25) && (valueDirection < 33.75)) {
        // value is north-northeast
        statsWindDirectionSub.textContent = "north-northeast";
    } else if ((valueDirection >= 33.75) && (valueDirection < 56.25)) {
        // value is northeast
        statsWindDirectionSub.textContent = "northeast";
    } else if ((valueDirection >= 56.25) && (valueDirection < 78.75)) {
        // value is east-northeast
        statsWindDirectionSub.textContent = "east-northeast";
    } else if ((valueDirection >= 78.75) && (valueDirection < 101.25)) {
        // value is east
        statsWindDirectionSub.textContent = "east";
    } else if ((valueDirection >= 101.25) && (valueDirection < 123.75)) {
        // value is east-southeast
        statsWindDirectionSub.textContent = "east-southeast";
    } else if ((valueDirection >= 123.75) && (valueDirection < 146.25)) {
        // value is southeast
        statsWindDirectionSub.textContent = "southeast";
    } else if ((valueDirection >= 146.25) && (valueDirection < 168.75)) {
        // value is south-southeast
        statsWindDirectionSub.textContent = "south-southeast";
    } else if ((valueDirection >= 168.75) && (valueDirection < 191.25)) {
        // value is south
        statsWindDirectionSub.textContent = "south";
    } else if ((valueDirection >= 191.25) && (valueDirection < 213.75)) {
        // value is south-southwest
        statsWindDirectionSub.textContent = "south-southwest";
    } else if ((valueDirection >= 213.75) && (valueDirection < 236.25)) {
        // value is southwest
        statsWindDirectionSub.textContent = "southwest";
    } else if ((valueDirection >= 236.25) && (valueDirection < 258.75)) {
        // value is west-southwest
        statsWindDirectionSub.textContent = "west-southwest";
    } else if ((valueDirection >= 258.75) && (valueDirection < 281.25)) {
        // value is west
        statsWindDirectionSub.textContent = "west";
    } else if ((valueDirection >= 281.25) && (valueDirection < 303.75)) {
        // value is west-northwest
        statsWindDirectionSub.textContent = "west-northwest";
    } else if ((valueDirection >= 303.75) && (valueDirection < 326.25)) {
        // value is northwest
        statsWindDirectionSub.textContent = "northwest";
    } else if ((valueDirection >= 326.25) && (valueDirection < 348.75)) {
        // value is north-northwest
        statsWindDirectionSub.textContent = "north-northwest";
    } else if ((valueDirection >= 348.75) && (valueDirection <= 360)) {
        // value is north
        statsWindDirectionSub.textContent = "north";
    } else {
        // value is no value
        statsWindSpeedSub.textContent = "no data";
    }
    return;
};

function getCurrentTime() {
    /* Get the current time */
    // let currentTimeAWH = Math.floor(new Date().getTime()/1000.0);
    // console.log("current time = " + currentTimeAWH);
};

function convertUTC(utcSeconds, counter) {
    //console.log("date = " + counter + " " + utcSeconds);

    /* Convert utcSeconds to a Date */
    var dtDate = new Date(0);
    dtDate.setUTCSeconds(utcSeconds);
    //console.log("converted time = " + dtDate);

    /* Convert Date to a string */
    var dtDateString = String(dtDate);

    /* Parse the day of the week, month, day, year */
    // Thu Apr 06 2023 13:00:00 GMT-0700 (Pacific Daylight Time)
    var splitDateArray = dtDateString.split(" ");
    
    // var text = "How are you doing today?";
    // var myArray = text.split(" ");
    //console.log(splitDateArray);

    return;
    
};


var displayWeather = function(z) {
    /* Display results */
    
    /*
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
    weatherContainer.appendChild(cityEl); */
};





// Get repos by language
var getFeaturedRepos = function(language) {
    // Construct the API URL var
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    
    //console.log(apiUrl);
    //console.log(language);
    
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
    //console.log("current language = " + language);
    if (language) {
        getFeaturedRepos(language);
      
        // clear old content
        weatherContainerEl.textContent = "";
      }
};


cityForm.addEventListener("submit", formSubmitStart);
// languageButtonsEl.addEventListener("click", buttonClickHandler);
changeColor(randomNumber,nightOrDay);