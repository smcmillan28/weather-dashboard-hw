// Defining initial variables to use for later functions/click events
var citySearch = $("#city-search");
var searchBtn = $("#search-button");
var searchHist = $("#past-searches");
var currentWeather = $("#current-weather");
var forecast = $("#forecast");

//Empty array to store cities that are searched
var pastSearch = [];

// Moment.js used for date display when city is searched
var currentTime = moment();
var currentDay = currentTime.format("MMMM D, YYYY");

// Write a function that will create a button once the search button is clicked and store that city as the button text
// This function also stores those cities in the pastSearch array and sends that array to local storage
function addCity(event) {
    event.preventDefault();
    if (citySearch.val() != "") {
        var newCity = citySearch.val();
        var newButton = $("<button>").addClass("btn btn-primary");
        newButton.text(newCity);
        searchHist.prepend(newButton);
        pastSearch.unshift(newCity);
        localStorage.setItem("oldCities", JSON.stringify(pastSearch));
    } else {
        return;
    }
    citySearch.val("");
}

// Write a function that makes an AJAX call to open Weather API
function weatherData() {
    // Clearing previous data from page
    currentWeather.empty();

    // Using Position Stack Geocoding API to get latitude and longitude for city input
    var cityName = citySearch.val();
    var cityQueryUrl = "http://api.positionstack.com/v1/forward?access_key=1d9b73328157570ee57517d73c03e071&query=" + cityName;

    // AJAX call to find where latitude and longitude are stored in the response
    $.ajax({
        url: cityQueryUrl,
        method: "GET"
    }).then(function (res) {
        console.log(res);
        // Storing response object data in latitude and longitude variables
        var lat = res.data[0].latitude;
        var lon = res.data[0].longitude;

        // Open Weather API query URL in the form of a string
        var weatherQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=c8d8b26d88e2efcce705725f885fb689";

        $.ajax({
            url: weatherQueryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            // Creating div and all different HTML elements to store current weather data then appending that to the page
            var allCurrent = $("<div>").addClass("section");
            var currentHeader = $("<h3>").text("Current Weather and Forecast");
            var lineBreak = $("<hr>");
            var currentIcon = response.current.weather[0].icon;
            var iconURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + ".png");
            var cityHeader = $("<h4>").text(cityName + " (" + currentDay + ") ");
            cityHeader.append(iconURL);
            var currentTemp = Math.ceil(response.current.temp);
            var cityTemp = $("<p>").text("Temperature: " + currentTemp + " \xB0F");
            var humidity = $("<p>").text("Humidity: " + response.current.humidity + "%");
            var windSpeed = $("<p>").text("Wind Speed: " + response.current.wind_speed + " mph");
            var uvInd = response.current.uvi;
            var uvDisp = $("<p>").text("UV Index: " + uvInd);
            allCurrent.append(currentHeader, lineBreak, cityHeader, cityTemp, humidity, windSpeed, uvDisp);
            currentWeather.append(allCurrent);





        });


    });

}

searchBtn.on("click", weatherData);
searchBtn.on("click", addCity);