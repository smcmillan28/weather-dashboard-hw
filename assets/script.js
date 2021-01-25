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

searchBtn.on("click", addCity);

// Write a function that makes an AJAX call to open Weather API

function weatherData() {

    var lat = 33.441792
    var lon = -94.037689
    var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=c8d8b26d88e2efcce705725f885fb689"

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
}

searchBtn.on("click", weatherData)