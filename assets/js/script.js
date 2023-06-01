/* Created by Anthony Hall */
/* Updated on May 26, 2023 */

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

// Establish a random number between 1 and 4, used to determine which background to display
min = Math.ceil(1);
max = Math.floor(5);
let randomNumber = Math.floor(Math.random() * (max - min) + min);

function changeColor(randomNumber,nightOrDay) {
    // Identify what we will be updating
    const backGradient = document.getElementById("anotherNamePerhaps");

    let correctClass = "flex-column min-100-vh" + " chooseBackground" + nightOrDay + randomNumber;
    backGradient.className = correctClass;
};

/* Define global vars */
let apiKey = "95b40b7251d7c4d04d5bc72b6c0d970e";
let count = 0;
let counter = 0;
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
let nameCity = document.querySelector("#cityName"); // actual input value
let promptModal = document.querySelector("#promptModal");
let weatherContainer = document.querySelector("#weatherContainer");
let searchContainer = document.querySelector("#searchContainer");
let citySearchTerm = document.querySelector("#city-search-term");
let searchIcon = document.querySelector(".searchIcon");
let searchTime = document.querySelector(".searchTime");
let searchTemp = document.querySelector(".searchTemp");
let titleApp = document.querySelector(".appTitle");
let subTitle = document.querySelector(".subTitle");
let pastSearchesContainer = document.querySelector("#pastSearchesContainer");
let citySearchNumber = document.querySelector("#city-search-number");
let singleLocationDesc = document.querySelector("#singleLocationDesc");
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
let formSubmitStart = function(event) {
    // Stop default event from firing
    event.preventDefault();
    
    // Get value from input element
    let nameCity = cityName.value.trim();
    nameCity = toLowCase(nameCity);
    console.log(nameCity);

    if (nameCity) {
        lookUpCity(nameCity);
        cityName.value = "";
        displayUiElements();
    } else {
        alert("Please enter a US city name.");
    }
};

function displayUiElements() {
    promptModal.style.display = "none";
    searchIcon.style.display = "block";
    searchTime.style.display = "block";
    searchTemp.style.display = "block";
    selectCityContainer.style.display = "flex";
}

// Function to make city name title case for display
function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
};

// Function to making city name all lowercase for local storage
function toLowCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toLowerCase() + word.slice(1));
    }).join(' ');
};

// Function to find the lat and long of the city inputed  
let lookUpCity = function(location) {
    // Format the API URL
    let cityAPIValue = location+",,US";
    let geoAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityAPIValue+"&limit=50&appid="+apiKey;

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
                        subTitle.style.display = "block";
                        // Change the app title
                        titleApp.textContent = "Which " + toTitleCase(location) + "?";
                        // Change the results definition
                        citySearchNumber.textContent = geoData.length;
                        // Change the search term
                        citySearchTerm.textContent = toTitleCase(location);
                    } else {
                        let locationName = geoData[0].name;
                        let latValue = geoData[0].lat;
                        let lonValue = geoData[0].lon;
                        getCityWeather(locationName, latValue, lonValue);
                        saveToStorage(location);
                    };  
                });
            } else  {
                alert("Error: City could not be found.");
            };
        })
        .catch(function(error) {
            alert("Error: City cound not be found.");
        });
};

// Ask the user which city they want to get weather for
let selectWhichCity = function(location) {
    // This function only fires when there are multiple locations
    
    let sizeArray = location.length;

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
        let cityEl = document.createElement("a");
        cityEl.classList = "listItem flex-row justify-space-between align-center";
        cityEl.setAttribute("href", "#");
        cityEl.onclick = function() { getCityWeather(displayCity[t], displayLat[t], displayLon[t]); };

        // create a span element to hold city name
        let titleEl = document.createElement("span");
        titleEl.textContent = displayCity[t] + ", " + displayState[t];

        // append to container
        cityEl.appendChild(titleEl);

        // append container to the dom
        weatherContainer.appendChild(cityEl);
    };
}

// Get All the weatherData By location
let getCityWeather = function(location, latValue, lonValue) {
    // format the WeatherData API URL
    let apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+latValue+"&lon="+lonValue+"&appid="+apiKey+"&units=imperial&exclude=hourly,minutely";
     
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

let saveToStorage = function(queryLocation) {
    let locationArr = JSON.parse(localStorage.getItem("searchObject"));

    // Check if LocalStorage is empty
    if (locationArr) {
        // LocalStorage is not empty
        const arrayLength = Object.keys(locationArr).length;
        locationArr = locationArr ? locationArr : {};
        locationArr['searchLocation'+ arrayLength] = queryLocation;
        console.log(localStorage.getItem("searchObject").includes(queryLocation));
        
        // Update the request only if it didn't exist
        if (localStorage.getItem("searchObject").includes(queryLocation) == false) {    
            localStorage.setItem('searchObject', JSON.stringify(locationArr));
        };
    } else {
        // Create a new object
        let searchObject = {
            searchLocation0: queryLocation
        }

        // Add the object in LocalStorage
        localStorage.setItem("searchObject", JSON.stringify(searchObject));
    };
    count++;
}

let pullWeather = function(weatherData, searchTerm) {
    // Check and verify if API returned any weatherData
    let size = Object.keys(weatherData).length;
    if (size === 0) {
        weatherContainer.textContent = "No city by that name found. Please try again.";
        return;
    }
    // Clear old content just in case
    weatherContainer.textContent = "";
    //citySearchTerm.textContent = searchTerm; 

    // First, let's update the heading...
    titleApp.textContent = "The weather in " + searchTerm + " is...";

    // Second, let's hide the subTitle (results text)
    subTitle.style.display = "none";

    selectCityContainer.style.display = "none";
    currentConditionsContainer.style.display = "inline-block";
    currentWeatherContainer.style.display = "flex";
    currentWeatherStatsContainer.style.display = "flex";

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
    singleLocationDesc.textContent = currentWeatherMain;
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
        //display5Day(i);
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
    let currentTime = Math.floor(new Date().getTime()/1000.0);
    // console.log("current time = " + currentTime);
    convertUTC(currentTime)
};

function convertUTC(utcSeconds) {
    // console.log("date = " + utcSeconds);

    /* Convert utcSeconds to a Date */
    let dtDate = new Date(0);
    dtDate.setUTCSeconds(utcSeconds);
    // console.log("converted time = " + dtDate);

    /* Convert Date to a string */
    let dtDateString = String(dtDate);
    // console.log(dtDateString);

    /* Parse the day of the week, month, day, year */
    // Thu Apr 06 2023 13:00:00 GMT-0700 (Pacific Daylight Time)
    let splitDateArray = dtDateString.split(" ");
    // console.log(splitDateArray);
    let onlyTime = splitDateArray[4];
    // console.log(onlyTime);
    // console.log(typeof onlyTime);
    let onlyTimeConverted = onlyTime.split(":");
    let onlyTimeDay;
    let onlyTimeConvertFirstNumber;
    if (Number(onlyTimeConverted[0] > 12)) {
        onlyTimeDay = "PM";
        onlyTimeConvertFirstNumber = Number(onlyTimeConverted[0]) - 12;
    } else {
        onlyTimeDay = "AM";
    };
    
    searchTime.textContent = "current time is " + onlyTimeConvertFirstNumber + ":" + onlyTimeConverted[1] + onlyTimeDay;
    return;
};
;

// Function to display the search modal when search icon is clicked
let searchButtonClick = function(event) {
    promptModal.style.display = "block";
    searchIcon.style.display = "none";
    searchTime.style.display = "none";
    searchTemp.style.display = "none";
    selectCityContainer.style.display = "none";
    currentConditionsContainer.style.display = "none";
    currentWeatherContainer.style.display = "none";
    currentWeatherStatsContainer.style.display = "none";
};

// Function fired to check if there is history.
let checkSearchHistory = function() {
    // Define what we are looking for in localStorage
    let locationArr = JSON.parse(localStorage.getItem("searchObject"));
    
    // Check if LocalStorage is not empty
    if (locationArr) {
        // Array is not empty
        // Get the length (key value pairs) in the array the array 
        const arrayLength = Object.keys(locationArr).length;
        
        // This loop was used for testing whether I could get the values in an array
        for(let key in locationArr) {
            // increase the count
            ++counter;
        };

        // This loop is used to get both the key and value in the array
        for (const [key, value] of Object.entries(locationArr)) {
            // Build the Search History buttons
            let cityBut = document.createElement("button");
            // cityBut.classList = "listItem flex-row justify-space-around align-end";
            cityBut.classList = "btn";
            cityBut.setAttribute("type", "button");
            cityBut.setAttribute("id", "button" + `${key}`);
            cityBut.setAttribute("data-search", `${value}`);
            cityBut.innerHTML = toTitleCase(`${value}`);

            // Append container to the DOM
            searchContainer.appendChild(cityBut);
        };
        
        // Show the Search History area
        pastSearchesContainer.style.display = "flex";
    };
};

//  Function fired when a search history button is clicked
let searchHistoryClick = function(event) {
    let whichSearch = event.target.getAttribute("data-search");
    whichSearch = toTitleCase(whichSearch);
    cityName.value = whichSearch;
    lookUpCity(whichSearch);
    displayUiElements();
};

// Function fired after DOM has loaded
window.addEventListener('load', function() {
    getCurrentTime();
    
    cityName.blur();
    // Check to see if there is any search history in local storage
    checkSearchHistory();
    
    browserWidth = window.innerWidth;
    browserHeight = window.innerHeight;
    // Change the display view to account for smaller devices
    if (browserWidth < 640) {
        // modify the header section for mobile devices
        currentWeatherContainer.classList.remove("flex-row");
        currentWeatherContainer.classList.add("flex-column");
    };
});

// Function fired as the page is being resized
window.addEventListener('resize', function(event){
    browserWidth = window.innerWidth;
    browserHeight = window.innerHeight;
    // Change the display view to account for smaller devices
    if (browserWidth < 640) {
        // modify the header section for mobile devices
        currentWeatherContainer.classList.remove("flex-row");
        currentWeatherContainer.classList.add("flex-column");
    };
    //console.log('Window size: ' + window.innerWidth + 'x' + window.innerHeight);
});

// Event listeners
cityForm.addEventListener("submit", formSubmitStart);
searchIcon.addEventListener("click", searchButtonClick);
searchContainer.addEventListener("click", searchHistoryClick);

// Call this function after all has loaded
changeColor(randomNumber,nightOrDay);