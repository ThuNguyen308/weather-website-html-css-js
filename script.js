// API
const geoApiOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "fca3786f3fmshf99f7afb612bf2fp13a15bjsn2fc1e9fff24d",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};

const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";
const WEATHER_API_KEY = "648a006259a6df7f5491bae0aca7559d";

//
const searchInput = document.querySelector("#search-input");
let searchResultsBox = document.querySelector(".search-results ul");
const dailyForecast = document.querySelector("#daily-items");
//today weather
const city = document.querySelector("#city");
const condition = document.querySelector("#condition");
const degree = document.querySelector("#degree");
const icon = document.querySelector("#icon");
const cloud = document.querySelector("#cloud");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");

//format day
const formatDate = (date) => {
  const arr = date.split("-");
  return arr[2] + "-" + arr[1];
};

//debound time
function debounce(func, timeout = 600){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args);
    console.log(this, args) }, timeout);
  };
}



const weatherForecastFetch = (lon, lat, name) => {
  dailyForecast.innerHTML = "";
  const forecastFetch = fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=dff12ad1da154b909f125206232903&q=${lat},${lon}&days=7&aqi=no&alerts=no`
  )
    .then((response) => response.json())
    .then((response) => {

      const weatherResponse = response.current;
      const forecastResponse = response.forecast.forecastday;

      //TODAY WEATHER
      city.innerHTML = name;
      icon.src = weatherResponse.condition.icon;
      condition.innerHTML = weatherResponse.condition.text;
      degree.innerHTML = Math.round(weatherResponse.feelslike_c) + "℃";
      cloud.innerHTML = weatherResponse.cloud + "%";
      wind.innerHTML = weatherResponse.wind_mph + "mph";
      humidity.innerHTML = weatherResponse.humidity + "%";
      pressure.innerHTML = weatherResponse.pressure_mb + "mb";

      //DAILY FORECAST
      let htmls = forecastResponse.map(
        (item) => `<div class="daily-item">
        <p>${formatDate(item.date)}</p>
        <img src=${item.day.condition.icon}>
        <span>${Math.round(item.day.maxtemp_c)}°</span>
        <span>${Math.round(item.day.mintemp_c)}°</span>
      </div>`);
      dailyForecast.innerHTML = htmls.join('');
    })
    .catch(console.log);
};

const geoApiFetch = function() {
	searchResultsBox.innerHTML = "";
	fetch(`${GEO_API_URL}/cities?namePrefix=${searchInput.value}`, geoApiOptions)
    .then((response) => response.json())
    .then((cities) => {
      let htmls = cities.data.map(
        city => `<li class="search-result" data-lat=${city.latitude} data-lon=${city.longitude}>${city.city}, ${city.country}</li>`
      )
      searchResultsBox.innerHTML = htmls.join('') || `<li class="no-result">No result is found</li>`
      const searchResults = document.querySelectorAll(".search-result");

      for (let searchResult of searchResults) {
        let lat = searchResult.getAttribute("data-lat");
        let lon = searchResult.getAttribute("data-lon");
        let name = searchResult.innerText;
        searchResult.addEventListener("click", () => {
          searchResultsBox.innerHTML = "";
          searchInput.value = "";
          weatherForecastFetch(lon, lat, name);
        });
      }
    })
    .catch((err) => console.error(err));
}

searchInput.addEventListener("input", debounce(() => geoApiFetch()));