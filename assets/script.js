$(document).ready(function () {

    // Defining initial variables to use for later functions/click events
    var citySearch = $("#city-search");
    var searchBtn = $("#search-button");
    var searchHist = $("#past-searches");
    var currentWeather = $("#current-weather");
    var forecast = $("#forecast");
    var fiveDay = $("#five-day");
    var clearBtn = $("#clear-history");

    // Setting variable to store cities to local storage that are searched and that retrieves and past searches from local storage
    var pastSearch = [];

    // Moment.js used for date display when city is searched and for the five day forecast
    var currentTime = moment();
    var currentDay = currentTime.format("MMMM D, YYYY");
    console.log(currentTime);

    var newOne = moment().add(1, "d");
    var newTwo = moment().add(2, "d");
    var newThree = moment().add(3, "d");
    var newFour = moment().add(4, "d");
    var newFive = moment().add(5, "d");

    var dayOne = newOne.format("L");
    var dayTwo = newTwo.format("L");
    var dayThree = newThree.format("L");
    var dayFour = newFour.format("L");
    var dayFive = newFive.format("L");


    // Write a function that will create a button once the search button is clicked and store that city as the button text
    // This function also stores those cities in the pastSearch array and sends that array to local storage
    function addCity(event) {
        event.preventDefault();
        var existingEntries = JSON.parse(localStorage.getItem("oldCities"));
        if (existingEntries == null) existingEntries = [];
        var newCity = citySearch.val();
        if (newCity != "" && $.inArray(newCity, existingEntries) === -1) {
            var newButton = $("<button>").addClass("btn btn-primary history");
            newButton.text(newCity);
            searchHist.prepend(newButton);
            localStorage.setItem("newEntry", JSON.stringify(newCity));
            existingEntries.unshift(newCity);
            localStorage.setItem("oldCities", JSON.stringify(existingEntries));
        } else {
            citySearch.val("");
            return;
        }
        citySearch.val("");
    }

    // Write a function that makes an AJAX call to open Weather API
    function weatherData() {

        var cityName = citySearch.val();
        var cityQueryUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + cityName + "&key=71439f3bcbcb4912afbab305c9f45c1c";

        // Using OpenCage Geocoding API to get latitude and longitude for city input
        // AJAX call to find where latitude and longitude are stored in the response
        $.ajax({
            url: cityQueryUrl,
            method: "GET"
        }).then(function (res) {
            console.log(res);
            // Storing response object data in latitude and longitude variables
            var lat = res.results[0].geometry.lat;
            var lon = res.results[0].geometry.lng;
            var cityRendered = res.results[0].formatted;

            console.log(lat);
            console.log(lon);
            console.log(cityRendered);

            // Clearing previous data from page
            currentWeather.empty();
            forecast.empty();
            fiveDay.empty();

            // Open Weather API query URL in the form of a string
            var weatherQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=c8d8b26d88e2efcce705725f885fb689";

            $.ajax({
                url: weatherQueryUrl,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                // Creating div and all different HTML elements to store current weather data then appending that to the page
                var allCurrent = $("<div>").addClass("section");
                var currentHeader = $("<h3>").text("Current Weather");
                var lineBreak = $("<hr>");
                var currentIcon = response.current.weather[0].icon;
                var iconURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + ".png");
                var cityHeader = $("<h5>").text(cityRendered + " (" + currentDay + ") ");
                cityHeader.append(iconURL);
                var currentTemp = Math.ceil(response.current.temp);
                var cityTemp = $("<h6>").text("Temperature: " + currentTemp + " \xB0F");
                var humidity = $("<h6>").text("Humidity: " + response.current.humidity + "%");
                var windSpeed = $("<h6>").text("Wind Speed: " + response.current.wind_speed + " mph");
                var uvInd = response.current.uvi;
                var uvDisp = $("<h6>").text("UV Index: " + uvInd);
                if (uvInd < 3) {
                    uvDisp.addClass("green");
                } else if (uvInd < 6) {
                    uvDisp.addClass("orange");
                } else if (uvInd >= 6) {
                    uvDisp.addClass("red");
                }
                allCurrent.append(currentHeader, lineBreak, cityHeader, cityTemp, humidity, windSpeed, uvDisp);
                currentWeather.append(allCurrent);

                // Creating div for weather forecast header
                var forecastDiv = $("<div>");
                var forecastHeader = $("<h3>").text("5 Day Forecast");
                forecastDiv.append(forecastHeader);
                forecast.append(forecastDiv);

                // Create columns and info for each following day of the five-day forecast
                var oneFollow = $("<div>").addClass("col-md-2");
                var oneHeader = $("<p>").text(dayOne);
                var dayOneIcon = response.daily[1].weather[0].icon;
                var dayOneURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dayOneIcon + ".png");
                var oneTemp = $("<p>").text("Temp: " + Math.ceil(response.daily[1].temp.day) + " \xB0F");
                var oneHum = $("<p>").text("Humidity: " + response.daily[1].humidity + "%");
                oneFollow.append(oneHeader, dayOneURL, oneTemp, oneHum);
                fiveDay.append(oneFollow);

                var twoFollow = $("<div>").addClass("col-md-2");
                var twoHeader = $("<p>").text(dayTwo);
                var dayTwoIcon = response.daily[2].weather[0].icon;
                var dayTwoURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dayTwoIcon + ".png");
                var twoTemp = $("<p>").text("Temp: " + Math.ceil(response.daily[2].temp.day) + " \xB0F");
                var twoHum = $("<p>").text("Humidity: " + response.daily[2].humidity + "%");
                twoFollow.append(twoHeader, dayTwoURL, twoTemp, twoHum);
                fiveDay.append(twoFollow);

                var threeFollow = $("<div>").addClass("col-md-2");
                var threeHeader = $("<p>").text(dayThree);
                var dayThreeIcon = response.daily[3].weather[0].icon;
                var dayThreeURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dayThreeIcon + ".png");
                var threeTemp = $("<p>").text("Temp: " + Math.ceil(response.daily[3].temp.day) + " \xB0F");
                var threeHum = $("<p>").text("Humidity: " + response.daily[3].humidity + "%");
                threeFollow.append(threeHeader, dayThreeURL, threeTemp, threeHum);
                fiveDay.append(threeFollow);

                var fourFollow = $("<div>").addClass("col-md-2");
                var fourHeader = $("<p>").text(dayFour);
                var dayFourIcon = response.daily[4].weather[0].icon;
                var dayFourURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dayFourIcon + ".png");
                var fourTemp = $("<p>").text("Temp: " + Math.ceil(response.daily[4].temp.day) + " \xB0F");
                var fourHum = $("<p>").text("Humidity: " + response.daily[4].humidity + "%");
                fourFollow.append(fourHeader, dayFourURL, fourTemp, fourHum);
                fiveDay.append(fourFollow);

                var fiveFollow = $("<div>").addClass("col-md-2");
                var fiveHeader = $("<p>").text(dayFive);
                var dayFiveIcon = response.daily[5].weather[0].icon;
                var dayFiveURL = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + dayFiveIcon + ".png");
                var fiveTemp = $("<p>").text("Temp: " + Math.ceil(response.daily[5].temp.day) + " \xB0F");
                var fiveHum = $("<p>").text("Humidity: " + response.daily[5].humidity + "%");
                fiveFollow.append(fiveHeader, dayFiveURL, fiveTemp, fiveHum);
                fiveDay.append(fiveFollow);
            });
        });
    }

    searchBtn.on("click", weatherData);
    searchBtn.on("click", addCity);

    // Write function that takes search history button data and re-runs weatherData function
    $(document).on("click", ".history", function () {
        citySearch.val($(this).text());
        weatherData();
        citySearch.val("");
    });

    // Write function that renders anything from local storage on to page in form of button
    function renderStorage() {
        var oldCities = JSON.parse(localStorage.getItem("oldCities"));
        console.log(oldCities);
        if (oldCities !== null) {
            for (var i = 0; i < oldCities.length; i++) {
                var genButton = $("<button>").addClass("btn btn-primary history");
                genButton.text(oldCities[i]);
                searchHist.append(genButton);
            }
        } else if (oldCities === null) {

        }
    }

    function restore() {
        var oldSearches = JSON.parse(localStorage.getItem("oldCities"));
        localStorage.setItem("oldCities", JSON.stringify(oldSearches));
    }

    // init function that calls renderStorage function and init call to run when page is loaded
    function init() {
        restore();
        renderStorage();
    }

    init();

    // Write a function that clears local storage and clears the search history buttons when "Clear Search" button is clicked
    clearBtn.click(function() {
        localStorage.removeItem("oldCities");
        searchHist.empty();
    });

});