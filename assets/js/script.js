/* Created by Anthony Hall */
/* Updated on March 30, 2023 */

/* Variables for UTC conversion */
const oneYear = 31556926;
const oneMonth = 2629743;
const oneWeek = 604800;
const oneDay = 86400;
const oneHour = 3600;

var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#cityName");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var languageButtonsEl = document.querySelector("#language-buttons");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var cityname = nameInputEl.value.trim();

    if (cityname) {
        getCityWeather(cityname);
        nameInputEl.value = "";
    } else {
        alert("Please enter a city.");
    }
};

var displayWeather = function(weatherData, searchTerm) {
    // check if api returned any weatherData
    var size = Object.keys(weatherData).length;
    if (size === 0) {
        weatherContainerEl.textContent = "No city by that name found.";
        return;
    }
    // clear old content
    weatherContainerEl.textContent = "";
    citySearchTerm.textContent = searchTerm;

    // loop over weatherData
    for (var i = 0; i < size + 1; i++) {
        // format city name
        let cityNameFullMax = weatherData.daily[i].temp.max;
        let cityNameMax = Math.trunc(cityNameFullMax);
        
        let cityNameFullMin = weatherData.daily[i].temp.min;
        let cityNameMin = Math.trunc(cityNameFullMin);

        let cityDateUTC = weatherData.daily[i].dt;
        convertUTC(cityDateUTC);
    
        // create a container for each day of the week
        var cityEl = document.createElement("a");
        cityEl.classList = "list-item flex-row justify-space-between align-center";
        cityEl.setAttribute("href", "./daily.html?city=" + cityName);
    
        // create a span element to hold city name
        var titleEl = document.createElement("span");
        titleEl.textContent = cityNameMax + "/" + cityNameMin;
    
        // append to container
        cityEl.appendChild(titleEl);
    
        // append container to the dom
        weatherContainerEl.appendChild(cityEl);
    }
};

function getCurrentTime() {
    /* Get the current time */
    // let currentTimeAWH = Math.floor(new Date().getTime()/1000.0);
    // console.log("current time = " + currentTimeAWH);
};

function convertUTC(newCityDate) {
    console.log("current time = " + newCityDate);

    var utcSeconds = newCityDate;
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);
    console.log("converted time = " + d);
    return;

    // First look at the number of years...
    var getCurrentYear = Math.trunc(newCityDate/oneYear);
    // Now, get the current year
    var thisYear = getCurrentYear + 1970;
    console.log("current year = " + thisYear);
    // Next, get the number of days
    var getCurrentDays = Math.trunc((newCityDate - (getCurrentYear * oneYear))/oneDay);
    console.log("day of the month = " + getCurrentDays);
    // Next, is the current year a leap year
    if (thisYear == 2020 | thisYear == 2024) {
        var leapYear = 1;
    } else {
        var leapYear = 0;
    }
    console.log("Leap year? 1 for Yes; 0 for No. " + leapYear);
    // Now, I need to find out what month and day it is
    if (getCurrentDays <= 31) {
        // Month is January
        var getMonth = "January";
        var daysAtMonthStart = 0;
    } else if ((getCurrentDays > 31) && (getCurrentDays < 59)) {
        // Month is February
        var getMonth = "February";
        var daysAtMonthStart = 31;
    } else if ((getCurrentDays >= 59) && (getCurrentDays < 90)) {
        // Month is March
        var getMonth = "March";
        var daysAtMonthStart = 59;
    } else if ((getCurrentDays >= 90) && (getCurrentDays <= 120)) {
        // Month is April
        var getMonth = "April";
        var daysAtMonthStart = 90;
    } else if ((getCurrentDays > 120) && (getCurrentDays <= 151)) {
        // Month is May
        var getMonth = "May";
        var daysAtMonthStart = 120;
    } else if ((getCurrentDays > 151) && (getCurrentDays <= 181)) {
        // Month is June
        var getMonth = "June";
        var daysAtMonthStart = 151;
    } else if ((getCurrentDays > 181) && (getCurrentDays <= 212)) {
        // Month is July
        var getMonth = "July";
    } else if ((getCurrentDays > 212) && (getCurrentDays <= 243)) {
        // Month is August
        var getMonth = "August";
    } else if ((getCurrentDays > 243) && (getCurrentDays <= 273)) {
        // Month is September
        var getMonth = "September";
    } else if ((getCurrentDays > 273) && (getCurrentDays <= 304)) {
        // Month is October
        var getMonth = "October";
    } else if ((getCurrentDays > 304) && (getCurrentDays <= 334)) {
        // Month is November
        var getMonth = "November";
    } else if (getCurrentDays < 334) {
        // Month is December
        var getMonth = "December";
    }
    console.log ("Month is: " + getMonth);
    // Final step, find the day of the month
    var getDay = getCurrentDays - daysAtMonthStart;
    console.log(getDay);
    
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

// Get All the weatherData By location
var getCityWeather = function(location) {
    console.log("the location is: " + location);

    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=37.77&lon=-122.42&appid=95b40b7251d7c4d04d5bc72b6c0d970e&units=imperial&exclude=hourly,minutely";
     
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                
                response.json().then(function(data) {
                    console.log(data);
                    displayWeather(data, location);
                });
            } else {
                alert("Error: City could not be found.");
            };
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
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