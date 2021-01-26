// Defining initial variables to use for later functions/click events
var citySearch = $("#city-search");
var searchBtn = $("#search-button");
var searchHist = $("#past-searches");
var current = $("#current-weather");
var forecast = $("#forecast");

var pastSearch = [];

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
    // Using Position Stack Geocoding API to get latitude and longitude
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
        // Open Weather query URL
        var weatherQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=c8d8b26d88e2efcce705725f885fb689";

        $.ajax({
            url: weatherQueryUrl,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        });


    });

}

searchBtn.on("click", weatherData);
searchBtn.on("click", addCity);