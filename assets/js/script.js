
function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var todayWeatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];


    const APIKey = '4cb89caa97110410cfc97a47c4f376d3';

    function getWeather(cityName) {
    // execute a current weather request
        fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' +
        cityName +
        '&appid=' +
        APIKey
        )

        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response)
            todayWeatherEl.classList.remove("d-none");

            //parse response to display current weather
            const currentDate = new Date(response.dt * 1000);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.weather[0].icon;
            currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt", response.weather[0].description);
            currentTempEl.innerHTML = "Temperature: " + k2f(response.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";

            //get UV Index
            let lat = response.coord.lat;
            let lon = response.coord.lon;

            fetch(
                'https://api.openweathermap.org/data/2.5/uvi?lat=' +
                lat +
                '&lon=' +
                lon +
                '&appid=' +
                APIKey
            )

            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                console.log(response);
                let UVIndex = document.createElement("span");
                        
                // When UV Index is good, shows green, when ok shows yellow, when bad shows red
                if (response.value < 4 ) {
                    UVIndex.setAttribute("class", "badge badge-success");
                }
                else if (response.value < 8) {
                    UVIndex.setAttribute("class", "badge badge-warning");
                }
                else {
                    UVIndex.setAttribute("class", "badge badge-danger");
                }
                console.log(response.value)
                UVIndex.innerHTML = response.value;
                currentUVEl.innerHTML = "UV Index: ";
                currentUVEl.append(UVIndex);
        });
        let cityID = response.id;
        fetch(
            'https://api.openweathermap.org/data/2.5/forecast?id=' +
            cityID +
            '&appid=' +
            APIKey
        )

        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            fivedayEl.classList.remove("d-none");
                        
            //  Parse response to display forecast for next 5 days
            const forecastEls = document.querySelectorAll(".forecast");
            for (i = 0; i < forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                const forecastIndex = i * 8 + 4;
                const forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);

                // Icon for current weather
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt", response.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + k2f(response.list[forecastIndex].main.temp) + " &#176F";
                forecastEls[i].append(forecastTempEl);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);
            }
        })
    });
}

    // Get history from local storage if any
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    // Clear History button
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

initPage();