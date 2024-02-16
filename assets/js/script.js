/* Created by Anthony Hall */
/* Updated on June 8, 2023 */

/* Define global vars */
let apiKey = "95b40b7251d7c4d04d5bc72b6c0d970e";
let count = 0;
let counter = 0;
let delFlag;
let areCardsDisplayed = false;
let locationAlreadyInArray;
let currentDate;
let monthCurrent3letters;
let dayCurrent3letters;
let yearCurrent3letters;
let dayOfWeek3letters;
let maxDays;
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

const searchedLocations = [];
const dailyDate = [];
const dailyTime = [];
const dailyDayOfWeek = [];
const dailyTempDay = [];
const dailyTempMax = [];
const dailyTempMin = [];
const dailySunrise = [];
const dailySunriseConverted = [];
const dailySunset =  [];
const dailySunsetConverted = [];
const dailyMoonRise = [];
const dailyMoonSet = [];
const dailyMoonPhase = [];
const dailyHumidity = [];
const dailyWindSpeed = [];
const dailyWindDegrees = [];
const dailyWeatherIcon = [];
const dailyClouds = [];
const dailyPOP = [];
const dailyPOPConverted = [];
const dailyUVI = [];
const displayBottomUVI = [];
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
let introTitle = document.querySelector("#introTitle");
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
let fiveDayForecastCards = document.querySelector("#fiveDayForecastCards");

// Establish day or night
let currentTimeofDay = new Date();
let currentTimeInTheDay = currentTimeofDay.getHours();

if (currentTimeInTheDay >= 19) {
    var nightOrDay = "Night";
} else if (currentTimeInTheDay < 6) {
    var nightOrDay = "Night";
} else {
    var nightOrDay = "Day";
};

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

// Start here after form submit
let formSubmitStart = function(event) {
    // Stop default event from firing
    event.preventDefault();
    
    // Get value from input element
    let nameCity = cityName.value.trim();
    nameCity = toLowCase(nameCity);

    if (nameCity) {
        lookUpCity(nameCity);
        displayUiElements();
        cityName.value = "";
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
};

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

function getDayOfTheWeek(currentDayOfTheWeek) {
    if (currentDayOfTheWeek == 0) {
        return dayOfWeek3letters = "Sun"
    } else if (currentDayOfTheWeek == 1) {
        return dayOfWeek3letters = "Mon"
    } else if (currentDayOfTheWeek == 2) {
        return dayOfWeek3letters = "Tue"
    } else if (currentDayOfTheWeek == 3) {
        return dayOfWeek3letters = "Wed"
    } else if (currentDayOfTheWeek == 4) {
        return dayOfWeek3letters = "Thu"
    } else if (currentDayOfTheWeek == 5) {
        return dayOfWeek3letters = "Fri"
    } else {
        return dayOfWeek3letters = "Sat"
    };
};

function constructDate() {
    // Capture the current date
    let dateCurrent = new Date();
    let yearCurrent = dateCurrent.getFullYear();
    let monthCurrent = dateCurrent.getMonth();
    let dayCurrent = dateCurrent.getDate();

    // Get the current day of the week
    let dayOfWeekCurrent = dateCurrent.getDay();
    let dayOfWeek3letters = getDayOfTheWeek(dayOfWeekCurrent);
    
    // Build the dailyDayOfWeek array
    dailyDayOfWeek.push(dayOfWeek3letters);

    for (let tt=1; tt <= 6; tt++) {
        
        if (dayOfWeekCurrent < 6) {
            dayOfWeekCurrent++;
        } else {
            dayOfWeekCurrent = 0;
        };
            
        dayOfWeek3letters = getDayOfTheWeek(dayOfWeekCurrent);
        dailyDayOfWeek.push(dayOfWeek3letters);
    };

    // Create the date array
    for (let dd=0; dd < 5; dd++) {
        // Figure out the month
        console.log("The month is " + monthCurrent)
        if (monthCurrent == 0) {
            monthCurrent3letters = "Jan";
            maxDays = 31;
        } else if (monthCurrent == 1) {
            monthCurrent3letters = "Feb";
            if ((yearCurrent == 2024) || (yearCurrent == 2028)) {
                maxDays = 29;
            } else {
                maxDays = 28;
            };
        } else if (monthCurrent == 2) {
            monthCurrent3letters = "Mar";
            maxDays = 31;
        } else if (monthCurrent == 3) {
            monthCurrent3letters = "Apr";
            maxDays = 30;
        } else if (monthCurrent == 4) {
            monthCurrent3letters = "May";
            maxDays = 31;
        } else if (monthCurrent == 5) {
            monthCurrent3letters = "Jun";
            maxDays = 30;
        } else if (monthCurrent == 6) {
            monthCurrent3letters = "Jul";
            maxDays = 31;
        } else if (monthCurrent == 7) {
            monthCurrent3letters = "Aug";
            maxDays = 31;
        } else if (monthCurrent == 8) {
            monthCurrent3letters = "Sep";
            maxDays = 30;
        } else if (monthCurrent == 9) {
            monthCurrent3letters = "Oct";
            maxDays = 31;
        } else if (monthCurrent == 10) {
            monthCurrent3letters = "Nov";
            maxDays = 30;
        } else {
            monthCurrent3letters = "Dec";
            maxDays = 31;
        };

        // Figure out the day
        if (dayCurrent >= maxDays) {
            dayCurrent3letters = 1;
        } else {
            dayCurrent3letters = dayCurrent + dd;
        };

        if ((dayCurrent3letters >= 1) && (monthCurrent > 11)) {
            yearCurrent3letters = yearCurrent + 1;
        } else {
            yearCurrent3letters = yearCurrent;
        };

        // Construct the actual date
        dailyDate[dd] = monthCurrent3letters + " " + dayCurrent3letters + ", " + yearCurrent;
    };
};

// Function to find the lat and long of the city inputed  
let lookUpCity = function(location) {
    // Format the API URL
    let cityAPIValue = location+",,US";
    let geoAPIUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+cityAPIValue+"&limit=50&appid="+apiKey;
    fetch(geoAPIUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(geoData) {
                    // Identify the length of geoData array
                    if (geoData.length == 0) {
                        errorNoCityName(location);
                    } else if (geoData.length > 1) {                        
                        selectWhichCity(geoData);
                        saveToStorage(location);
                        createSearchHistoryButton(location);
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
                        console.log("locationName = " + locationName);
                        let latValue = geoData[0].lat;
                        let lonValue = geoData[0].lon;
                        getCityWeather(locationName, latValue, lonValue);
                        saveToStorage(location);
                        createSearchHistoryButton(location);
                    };  
                });
            } else  {
                alert("Error: City could not be found.");
            };
        })
        .catch(function(error) {
            alert("Error: Problem connecting to the API.");
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
        let displayCityRow = document.createElement("a");
        displayCityRow.classList = "listItem flex-row justify-space-between align-center";
        displayCityRow.setAttribute("href", "#");
        displayCityRow.onclick = function() { getCityWeather(displayCity[t], displayLat[t], displayLon[t]); };

        // create a span element to hold city name
        let titleHeading = document.createElement("span");
        titleHeading.textContent = displayCity[t] + ", " + displayState[t];

        // append to container
        displayCityRow.appendChild(titleHeading);

        // append container to the dom
        weatherContainer.appendChild(displayCityRow);
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
        // Variable to get the number of values in localStorage 
        const arrayLength = Object.keys(locationArr).length;
        
        searchedLocations[arrayLength] = queryLocation;
        locationArr = locationArr ? locationArr : {};
        locationArr['searchLocation'+ arrayLength] = queryLocation;
        
        // Update the request only if it didn't exist
        if (localStorage.getItem("searchObject").includes(queryLocation) == false) {    
            let currentSearchHistoryLength = arrayLength + 1;
            // Add the location to localStorage
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
};

let pullWeather = function(weatherData, searchTerm) {
    // Check and verify if API returned any weatherData
    let size = Object.keys(weatherData).length;
    if (size == 0) {
        weatherContainer.textContent = "No city by that name found. Please try again.";
        return;
    }
    // Clear old content just in case
    weatherContainer.textContent = "";
    //citySearchTerm.textContent = searchTerm; 

    // First, let's update the heading...
    titleApp.textContent = "";

    // Second, let's hide the subTitle (results text)
    subTitle.style.display = "none";

    // selectCityContainer.style.display = "none";
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
    getUVIndexVale(currentUVIndex,"currentUVIndex",0);
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
    };
    
    // Determine the sub text for feels like
    getFeelsLike(diffFeelsLikeValue,diffFeelsLikeBooleanValue);
    
    // Determine the sub text for humidity
    getHumidity(weatherData.current.humidity);
    
    // Determine the sub text for pressure value
    getPressure(weatherData.current.pressure);
        
    // Determine the sub text for uv index value
    (currentUVIndex, "currentUVIndex");

    // Determine the sub text for wind speed value
    getWindSpeed(currentWindSpeedWo);   

    // Determine the sub text for wind direction value
    // Reminder: Wind is blowing FROM, not where it is blowing towards.
    getWindDirection(currentWindDegreesWo); 

    // loop over weatherData
    for (let i = 0; i < size + 1; i++) {
        /* Grab all daily data and store in arrays */
        dailyTime[i] = weatherData.daily[i].dt;
        
        dailyTempDay[i] = weatherData.daily[i].temp.day;
        
        let dailyTempMaxBF = weatherData.daily[i].temp.max;
        dailyTempMax[i] = Math.trunc(dailyTempMaxBF);
        
        let dailyTempMinBF = weatherData.daily[i].temp.min;
        dailyTempMin[i] = Math.trunc(dailyTempMinBF);

        dailySunrise[i] = weatherData.daily[i].sunrise;
        convertUTC(dailySunrise[i],"dailySunrise",i);
        
        dailySunset[i] = weatherData.daily[i].sunset;
        convertUTC(dailySunset[i],"dailySunset",i);

        dailyMoonRise[i] = weatherData.daily[i].moonrise;
        dailyMoonSet[i] = weatherData.daily[i].moonset;
        dailyMoonPhase[i] = weatherData.daily[i].moon_phase;
        dailyHumidity[i] = weatherData.daily[i].humidity;
        dailyWindSpeed[i] = weatherData.daily[i].wind_speed;
        dailyWindDegrees[i] = weatherData.daily[i].wind_deg;
        dailyWeatherIcon[i] = weatherData.daily[i].weather[0].icon;
        let dailyWeatherIconURL = "/assets/images/" + dailyWeatherIcon[i] + "@1x.png";
        dailyClouds[i] = weatherData.daily[i].clouds;
        dailyPOP[i] = weatherData.daily[i].pop;
        dailyPOPConverted[i] = Math.round(dailyPOP[i] * 100);
        getPOP(dailyPOPConverted[i],i);

        dailyUVI[i] = weatherData.daily[i].uvi;

        // Finally, let's update the heading...
        titleApp.textContent = "The weather in " + searchTerm + " is...";

        /* Now update the UI */
        display5Day(i);
    };
};

function display5Day(t) {
    areCardsDisplayed = true;
    console.log(areCardsDisplayed);
    if (t < 5) {
        // Create the outer card for each day
        let fiveDayForecastCard = document.createElement("div");
        fiveDayForecastCard.classList = "fiveDayForecastCard";
        fiveDayForecastCard.setAttribute("id", "fiveDayForecastCard" + t);
        
        // Step 1 Get day of the week
        let fiveDayDOWElement = document.createElement("div");
        fiveDayDOWElement.classList = "dayOfWeek fiveDayCard";
        if (t == 0) {
            fiveDayDOWElement.innerHTML = "Today";
        } else {
            fiveDayDOWElement.innerHTML = dailyDayOfWeek[t];
        };
        
        // Append to container
        fiveDayForecastCard.appendChild(fiveDayDOWElement);

        // Step 2 Get date
        let fiveDayActDateElement = document.createElement("div");
        fiveDayActDateElement.classList = "actualDate fiveDayCard";
        fiveDayActDateElement.innerHTML = dailyDate[t];
        
        // Append Card container
        fiveDayForecastCard.appendChild(fiveDayActDateElement);

        // Step 3a Get icon URL and build containing div
        let fiveDayIconElement = document.createElement("div");
        fiveDayIconElement.classList = "fiveDayIcon fiveDayCard";
        
        // Append to Card container
        fiveDayForecastCard.appendChild(fiveDayIconElement);
        
        // Step 3b Create img 
        let fiveDayIconImgElement = document.createElement("img");
        fiveDayIconImgElement.setAttribute("src", "/assets/images/" + dailyWeatherIcon[t] + "@1x.png");

        // Append to Card container
        fiveDayIconElement.appendChild(fiveDayIconImgElement);


        // Step 4a Bottom stats main container 
        let fiveDayBottomContainer = document.createElement("div");
        fiveDayBottomContainer.setAttribute("id", "tempStatsContainer");

        // Append to Card container
        fiveDayForecastCard.appendChild(fiveDayBottomContainer);

        // Step 4b Bottom stats inside container
        let fiveDayBottomInnerContainer = document.createElement("div");
        fiveDayBottomInnerContainer.classList = "flex-row justify-center align-center";

        // Append to Bottom Container
        fiveDayBottomContainer.appendChild(fiveDayBottomInnerContainer);

        //  Step 4c Bottom stats inside left container
        let fiveDayBottomInnerLeftContainer = document.createElement("div");
        fiveDayBottomInnerLeftContainer.classList = "flex-column fifty-percentage";

        // Append to Bottom Container
        fiveDayBottomContainer.appendChild(fiveDayBottomInnerLeftContainer);

        // Step 4d Bottom detailed data
        let fiveDayBottomInnerLeftStat1 = document.createElement("div");
        fiveDayBottomInnerLeftStat1.classList = "fiveDayCard fiveDayTemp";
        fiveDayBottomInnerLeftStat1.innerHTML = dailyTempMax[t] + "°";

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat1);

        
        let fiveDayBottomInnerLeftStat2 = document.createElement("div");
        fiveDayBottomInnerLeftStat2.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerLeftStat2.innerHTML = "high";

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat2);

        
        let fiveDayBottomInnerLeftStat3 = document.createElement("div");
        fiveDayBottomInnerLeftStat3.classList = "fiveDayCard actualTime";
        fiveDayBottomInnerLeftStat3.innerHTML = dailySunriseConverted[t];

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat3);


        let fiveDayBottomInnerLeftStat4 = document.createElement("div");
        fiveDayBottomInnerLeftStat4.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerLeftStat4.innerHTML = "sunrise";

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat4);

        
        let fiveDayBottomInnerLeftStat5 = document.createElement("div");
        fiveDayBottomInnerLeftStat5.classList = "fiveDayCard actualTime";
        let dailyUVIndex = Math.round(dailyUVI[t] * 10)/10;
        fiveDayBottomInnerLeftStat5.innerHTML = dailyUVIndex;

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat5);

        
        let fiveDayBottomInnerLeftStat6 = document.createElement("div");
        fiveDayBottomInnerLeftStat6.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerLeftStat6.innerHTML = "uv index";

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat6);


        // Determine the sub text for uv index value
        let fiveDayBottomInnerLeftStat7 = document.createElement("div");
        fiveDayBottomInnerLeftStat7.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerLeftStat7.innerHTML = getUVIndexVale(dailyUVIndex,"dailyUVIndex",t);

        // Append to Bottom Left Container
        fiveDayBottomInnerLeftContainer.appendChild(fiveDayBottomInnerLeftStat7);

        
        // ----------
        //  Step 4e Bottom stats inside right container
        let fiveDayBottomInnerRightContainer = document.createElement("div");
        fiveDayBottomInnerRightContainer.classList = "flex-column fifty-percentage";

        // Append to Bottom Container
        fiveDayBottomContainer.appendChild(fiveDayBottomInnerRightContainer);

        // Step 4f Bottom detailed data
        let fiveDayBottomInnerRightStat1 = document.createElement("div");
        fiveDayBottomInnerRightStat1.classList = "fiveDayCard fiveDayTemp";
        fiveDayBottomInnerRightStat1.innerHTML = dailyTempMin[t] + "°";

        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat1);

        
        let fiveDayBottomInnerRightStat2 = document.createElement("div");
        fiveDayBottomInnerRightStat2.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerRightStat2.innerHTML = "low";

        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat2);

        
        // <div class="fiveDayCard actualTime">6:21am</div>
        let fiveDayBottomInnerRightStat3 = document.createElement("div");
        fiveDayBottomInnerRightStat3.classList = "fiveDayCard actualTime";
        fiveDayBottomInnerRightStat3.innerHTML = dailySunsetConverted[t];

        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat3);

        
        // <div class="fiveDayCard actualDate">sunrise</div>
        let fiveDayBottomInnerRightStat4 = document.createElement("div");
        fiveDayBottomInnerRightStat4.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerRightStat4.innerHTML = "sunset";

        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat4);

        
        // <div class="fiveDayCard actualTime">5.6</div>
        let fiveDayBottomInnerRightStat5 = document.createElement("div");
        fiveDayBottomInnerRightStat5.classList = "fiveDayCard actualTime";
        fiveDayBottomInnerRightStat5.innerHTML = (Math.round(dailyPOP[t] * 100)) + "%";
        
        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat5);

        
        // <div class="fiveDayCard actualDate">uv index</div>
        let fiveDayBottomInnerRightStat6 = document.createElement("div");
        fiveDayBottomInnerRightStat6.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerRightStat6.innerHTML = "rain probability";

        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat6);


        // <div class="fiveDayCard actualDate">seek shade</div>
        // Determine the sub text for uv index value
        let fiveDayBottomInnerRightStat7 = document.createElement("div");
        fiveDayBottomInnerRightStat7.classList = "fiveDayCard actualDate";
        fiveDayBottomInnerRightStat7.innerHTML = dailyPOPConverted[t];

        // Append to Bottom Right Container
        fiveDayBottomInnerRightContainer.appendChild(fiveDayBottomInnerRightStat7);
        
        //  ---------------

        // Append to container
        fiveDayBottomInnerContainer.appendChild(fiveDayBottomInnerLeftContainer);

        // Append to container
        fiveDayBottomInnerContainer.appendChild(fiveDayBottomInnerRightContainer);

        // Append to container
        fiveDayForecastCards.appendChild(fiveDayForecastCard);
    };
    
    fiveDayForecastHeader.style.display = "block";
    fiveDayForecastCardContainer.style.display = "block";
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
        statsFeelsLikeSub.textContent = "meh";
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

function getPOP(valuePOP,value) {
    if (valuePOP == 0) {
        return dailyPOPConverted[value] = "no chance";
    } else if (valuePOP <= 10) {
        return dailyPOPConverted[value] = "minimal";
    } else if ((valuePOP > 10) && (valuePOP <= 20)) {
        return dailyPOPConverted[value] = "pretty low";
    } else if ((valuePOP > 20) && (valuePOP <= 30)) {
        return dailyPOPConverted[value] = "low";
    } else if ((valuePOP > 30) && (valuePOP <= 40)) {
        return dailyPOPConverted[value] = "maybe";
    } else if ((valuePOP > 40) && (valuePOP <= 50)) {
        return dailyPOPConverted[value] = "maybe sorta";
    } else if ((valuePOP > 50) && (valuePOP <= 60)) {
        return dailyPOPConverted[value] = "moderate";
    } else if ((valuePOP > 60) && (valuePOP <= 70)) {
        return dailyPOPConverted[value] = "pretty high";
    } else if ((valuePOP > 70) && (valuePOP <= 80)) {
        return dailyPOPConverted[value] = "high";
    } else if ((valuePOP > 80) && (valuePOP <= 90)) {
        return dailyPOPConverted[value] = "very likely";
    } else {
        return dailyPOPConverted[value] = "it will rain";
    };
}

function getUVIndexVale(valueUVI,whatUVIVarName,value) {
    if (whatUVIVarName == "currentUVIndex") {
        if (valueUVI == 0) {
            // value is favorable
            statsUvIndexSub.textContent = "no worries";
        } else if (valueUVI <= 2) {
            // value is favorable
            statsUvIndexSub.textContent = "favorable";
            statsUvIndexSub.style.color = "#00FF00";
        } else if ((valueUVI > 2) && (valueUVI <= 7)) {
            // value is moderate
            statsUvIndexSub.textContent = "moderate";
            statsUvIndexSub.style.color = "#FFFF00";
        } else if (valueUVI > 7) {
            // value is severe
            statsUvIndexSub.textContent = "severe";
            statsUvIndexSub.style.color = "#FF0000";
        } else {
            statsUvIndexSub.textContent = "no data";
        };
    } else if (whatUVIVarName == "dailyUVIndex") {
        if (valueUVI == 0) {
            // value is favorable
            return displayBottomUVI[value] = "no worries";
        } else if (valueUVI <= 2) {
            // value is favorable
            return displayBottomUVI[value] = "favorable";
        } else if ((valueUVI > 2) && (valueUVI <= 7)) {
            // value is moderate
            return displayBottomUVI[value] = "moderate";
        } else if (valueUVI > 7) {
            // value is severe
            return displayBottomUVI[value] = "severe";
        } else {
            return displayBottomUVI[value] = "no data";
        };
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
    convertUTC(currentTime,"currentTime","none");
};

function convertUTC(utcSeconds,timeRequestSource,value) {  
    /* Convert utcSeconds to a Date */
    let dtDate = new Date(0);
    dtDate.setUTCSeconds(utcSeconds);

    /* Convert Date to a string */
    let dtDateString = String(dtDate);

    /* Parse the day of the week, month, day, year */
    let splitDateArray = dtDateString.split(" ");
    let onlyTime = splitDateArray[4];
    
    let onlyTimeConverted = onlyTime.split(":");
    let onlyTimeDay;
    let onlyTimeConvertFirstNumber;
    
    if (timeRequestSource == "dailySunrise") {
        onlyTimeDay = " AM";
        onlyTimeConvertFirstNumber = Number(onlyTimeConverted[0]);
        return dailySunriseConverted[value] = onlyTimeConvertFirstNumber + ":" + onlyTimeConverted[1] + onlyTimeDay;
    } else if (timeRequestSource == "dailySunset") {
        onlyTimeDay = " PM";
        onlyTimeConvertFirstNumber = Number(onlyTimeConverted[0]) - 12;
        return dailySunsetConverted[value] = onlyTimeConvertFirstNumber + ":" + onlyTimeConverted[1] + onlyTimeDay;
    } else if (timeRequestSource == "currentTime") {
        if (Number(onlyTimeConverted[0] > 12)) {
            onlyTimeDay = " PM";
            onlyTimeConvertFirstNumber = Number(onlyTimeConverted[0]) - 12;
        } else {
            onlyTimeDay = " AM";
            onlyTimeConvertFirstNumber = Number(onlyTimeConverted[0]);
        };
        return searchTime.textContent = "current time is " + onlyTimeConvertFirstNumber + ":" + onlyTimeConverted[1] + onlyTimeDay;
    };
    
};

function errorNoCityName(location) {
    // Hide and show some views
    cityName.value = "";
    titleApp.textContent = "";
    promptModal.style.display = "block";
    introTitle.textContent = "No city named '" + location + ".' Try again.";
    searchIcon.style.display = "none";
    searchTime.style.display = "none";
    searchTemp.style.display = "none";
    selectCityContainer.style.display = "none";
    currentConditionsContainer.style.display = "none";
    currentWeatherContainer.style.display = "none";
    currentWeatherStatsContainer.style.display = "none";
    fiveDayForecastHeader.style.display = "none"; 
    fiveDayForecastCardContainer.style.display = "none";
}

// Function to display the search modal when search icon is clicked
let searchButtonClick = function(event) {
    // Hide and show some views
    cityName.value = "";
    titleApp.textContent = "";
    
    if (areCardsDisplayed == true) {  
        for (let zz = 0; zz < 5; zz++) {
            let fiveDayForecastCard = document.querySelector("#fiveDayForecastCard" + zz);
            let parentDiv = fiveDayForecastCard.parentNode;
            parentDiv.removeChild(fiveDayForecastCard);
        };
        areCardsDisplayed == false;
    };
    
    promptModal.style.display = "block";
    introTitle.textContent = "What city do you want the weather for?";
    searchIcon.style.display = "none";
    searchTime.style.display = "none";
    searchTemp.style.display = "none";
    selectCityContainer.style.display = "none";
    currentConditionsContainer.style.display = "none";
    currentWeatherContainer.style.display = "none";
    currentWeatherStatsContainer.style.display = "none";
    fiveDayForecastHeader.style.display = "none"; 
    fiveDayForecastCardContainer.style.display = "none";
};

let createSearchHistoryButton = function(location) {
    let locationArr = JSON.parse(localStorage.getItem("searchObject"));
    const arrayLengthCreate = Object.keys(locationArr).length;

    // Build the Search History buttons
    let cityButNew = document.createElement("button");
    cityButNew.classList = "btn";
    cityButNew.setAttribute("type", "button");
    cityButNew.setAttribute("id", "buttonsearchLocation" + arrayLengthCreate);
    cityButNew.setAttribute("data-search", location);
    cityButNew.innerHTML = toTitleCase(location);

    // Append container to the DOM
    searchContainer.appendChild(cityButNew);

    for (const [key, value] of Object.entries(locationArr)) {
        let whatIsValue = toLowCase(`${value}`);
        if (whatIsValue == location) {
            locationAlreadyInArray = true;
            return;
        } 
    };  
};

// Function fired to check if there is history and to build the history buttons.
let checkSearchHistory = function() {
    // Define what we are looking for in localStorage
    let locationArr = JSON.parse(localStorage.getItem("searchObject"));
    
    // Check if LocalStorage is not empty
    if (locationArr) {
        // Array is not empty
        // Get the length (key value pairs) in the array the array 
        const arrayLength = Object.keys(locationArr).length;

        // This loop is used to get both the key and value in the array, then build the search history buttons
        for (const [key, value] of Object.entries(locationArr)) {
            // Build the Search History buttons
            let cityBut = document.createElement("button");
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
    whichSearch = toLowCase(whichSearch);
    cityName.value = whichSearch;
    selectCityContainer.style.display = "none";
    lookUpCity(whichSearch);
    displayUiElements();
};

// Function fired after DOM has loaded
window.addEventListener('load', function() {
    cityName.blur();
    // Check to see if there is any search history in local storage
    constructDate();
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
});

// Event listeners
cityForm.addEventListener("submit", formSubmitStart);
searchIcon.addEventListener("click", searchButtonClick);
searchContainer.addEventListener("click", searchHistoryClick);

// Call this function after all has loaded
changeColor(randomNumber,nightOrDay);

// SetTimeout for getting and updating the time
setTimeout(getCurrentTime,1000);