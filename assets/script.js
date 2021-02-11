var favoriteArr = ["Celebration", "Charlotte", "Hendersonville", "McMurray", "Tampa"];
var searchHistoryArr = [];
var userInput = "";
var APIKey = "&appid=3758324bb7cc715bc0076675d23131b9";
// var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr"));

function renderSearchHistory() {
    $("#searchHis").empty();

    for (var i = 0; i < searchHistoryArr.length; i++) {
        var p = $("<p>");

        p.addClass("searchHis waves-effect");
        p.attr("data-name", searchHistoryArr[i]);
        p.attr("href", "#!");
        p.text(searchHistoryArr[i]);
        $("#searchHis").append(p);
    }

}
renderSearchHistory();

function saveLS() {
    localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
}

//////////////////////////////////////////////////////////////////////////////////////////
$('#submitBtn').click(function (event) {
    event.preventDefault();
    //Take user input, store as var, display to search history and save to lS
    var userInput = $("#input").val();
    displayInformation(userInput);
    saveLS();
});
///////////////////////////////////////////////////////////////////////////////////////////

function displayInformation(userInput) {

     //Prepare for additional searches - remove data classes not related to future API responses
     $("#weatherContainer").empty();
     $("#cityContainer").empty();
     $("#weatherContainer").removeClass("hide");
     $("#cityContainer").removeClass("hide");
    //Establish URL for call #1 to acquire lon & lat values based on city name
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + userInput + APIKey;

    $.ajax({
        //Use city input and call for lat & lon data to use in second API
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {

            console.log(response);
            var lat = response[0].lat;
            var lon = response[0].lon;
            var city = response[0].name;
            var cityTitle = $("<h5>");
            (cityTitle).text(city);
            $("#cityContainer").append(cityTitle);

            if (!favoriteArr.includes(city)) {
            (searchHistoryArr).unshift(city);
            var historyDiv = $("<div>");
            $("#listHistory").prepend(historyDiv);
            $("#listHistory").prepend(city);
            
            }
      
            //Establish URL for call #2 to acquire current & 5-day weather data based on lat & lon
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts" + APIKey;

            $.ajax({
                //Use lat & lon for weather API
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response);

                    //Transfer content to HTML
                    //Current weather rendering
                    var cityContainer = $("<div>");
                    
                   
                    var cityHumid = $("<p>");
                    var cityWind = $("<p>");
                    var cityTemp = $("<p>");
                    var cityUV = $("<p>");
                                   
                    (cityTemp).text("Temp: " + ((response.current.temp - 273.15) * 1.80 + 32).toFixed(1) + "⁰ F");
                    (cityHumid).text("Humidity: " + response.current.humidity + "%");
                    (cityWind).text("Wind: " + response.current.wind_speed + " mph");

                    $("#cityContainer").append(cityContainer);
                 
                    $("#cityContainer").append(cityTemp);
                    $("#cityContainer").append(cityHumid);
                    $("#cityContainer").append(cityWind);
                                       

                    //UV index work with value & add styling based on value
                    var uvIndex = (response.current.uvi);
                    (cityUV).text("UV Index: " + uvIndex);
                    $("#cityContainer").append(cityUV);

                    if(uvIndex<4){
                        cityUV.css("color","green");
                        cityUV.css("font-weight","900");
                      } else if(uvIndex>10){
                        cityUV.css("color","red");
                        cityUV.css("font-weight","900");
                      } else{
                        cityUV.css("color","yellow");
                        cityUV.css("font-weight","900");
                      }

                    ////////////////////////////////////////////////////////////////////////////////////
                    //Five day forecast
                    for (var i = 1; i < 6; i++) {
         
                        var forecastDate = $("<p>");
                        var forecastImg = $("<img>");
                        var forecastTemp = $("<p>");
                        var forecastHumid = $("<p>");

                        var forecastContainer = $("<div>").addClass("col s12 m12 center forecastContainer");

                        //Date
                        forecastContainer.append(forecastDate);
                        forecastDate.text(new Date(response.daily[i].dt * 1000).toLocaleDateString());
                                             
                        //Icon
                        forecastContainer.append(forecastImg);
                        var imgIcon = response.daily[i].weather[0].icon;
                        forecastImg.attr("src", "http://openweathermap.org/img/wn/" + imgIcon + ".png");

                        //Temp
                        forecastContainer.append(forecastTemp);
                        forecastTemp.text(((response.daily[i].temp.max - 273.15) * 1.80 + 32).toFixed(1) + "⁰ F");

                        //Humid
                        forecastContainer.append(forecastHumid);
                        forecastHumid.text(response.daily[i].humidity + "% humidity");

                        $("#weatherContainer").append(forecastContainer);
                    }
       
                })
                renderSearchHistory();
        })

};

$('#searchHis').click(function (userInput) {
    if (!searchHistoryArr.includes(userInput)) {
        searchHistoryArr.push(city);
        displayInformation();
    }
    displayInformation(cityClicked);

});

$('.fav').click(function (event) {
    var favClicked = event.target.getAttribute("data-name");
    console.log(favClicked);
    displayInformation(favClicked);
});

///////////////////////////////////////////////////////////////////////////
let themeBridge = document.querySelector("#bridge");
let themeLake = document.querySelector("#lake");
let themeNight = document.querySelector("#night");
let themeOcean = document.querySelector("#ocean");
let themeSunset = document.querySelector("#sunset");

themeBridge.addEventListener('click', () => {
    document.body.style.backgroundImage = "url('assets/photos/bridge.jpg')";
});

themeLake.addEventListener('click', () => {
    document.body.style.backgroundImage = "url('assets/photos/boat.jpg')";
})
;
themeNight.addEventListener('click', () => {
    document.body.style.backgroundImage = "url('assets/photos/night.jpg')";
});

themeOcean.addEventListener('click', () => {
    document.body.style.backgroundImage = "url('assets/photos/sunrise.jpg')";
});

themeSunset.addEventListener('click', () => {
    document.body.style.backgroundImage = "url('assets/photos/sunset.jpg')";
});