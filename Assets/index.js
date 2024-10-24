const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const API_KEY = "9e0ff449d6ecb431c7f03daa438e872f";

const createWeatherCard = (cityName, weatherItem, index) => {
  if(index === 0) {
    return `<div class="details">
                <h2>${cityName}(${weatherItem.dt_txt.split("mm-dd-yyyy")[0]})</h2>
               <h4>Temperature:${weatherItem.main.temp}</h4>
            <h4>Wind:${weatherItem.wind.speed}</h4>
            <h4>Humidity:${weatherItem.main.humidity}</h4>;
              </div>
              <div class="icon">
                <img
                  src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png"
                  alt="weather-incons"/>
                <h4>${weatherItem.weather[0].description}</h4>
              </div>`
  } else{
  return `<li class="card">
            <h3>${weatherItem.dt_txt.split("mm-dd-yyyy")[0]}</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icons">
            <h4>Temperature:${weatherItem.main.temp}</h4>
            <h4>Wind:${weatherItem.wind.speed}</h4>
            <h4>Humidity:${weatherItem.main.humidity}</h4>
          </li>`
  }}


const getWeatherDetails = (cityName, lat, lon) =>{
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  
  fetch (WEATHER_API_URL).then(res => res.json()).then(data => {
    console.log(data);
   
   
    const uniqueForecastDays = [];

    const fiveDayForecast = data.list.filter(forecast => {
    const forecastDate = new Date(forecast.dt_txt).getDay();
    if(!uniqueForecastDays.includes(forecastDate)){
      return uniqueForecastDays.push(forecastDate)
    }
    });


    weatherCardsDiv.innerHTML = "";
    cityInput.value = "";
    currentWeatherDiv.innerHTML = "";


    console.log(fiveDayForecast);
    fiveDayForecast.forEach((weatherItem, index) => {
      if(index === 0) {
        currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));

      } else{
      weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
      }
    });
  }).catch(() => {
    alert("an error occurred while fetching the weather forecast")
});
} 

const getCityCoordinates = () =>{
  const cityName = cityInput.value.trim(); 
  if(!cityName) return;
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
  
  fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
    if(!data.length) return alert(`No coordinates found for ${cityName}`)
      const {name, lat, lon} = data[0]
    getWeatherDetails(name, lat, lon)
  }).catch(() => {
      alert("an error occurred while fetching the coordinates")
  });
}
const saveSearchHistory = (cityName) => {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
};

const loadSearchHistory = () => {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.forEach(city => {
    const cityElement = document.createElement('div');
    cityElement.textContent = city;
    cityElement.classList.add('history-item');
    cityElement.addEventListener('click', () => {
      cityInput.value = city;
      getCityCoordinates();
    });
  });
};

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    saveSearchHistory(cityName);
    loadSearchHistory();
  }
});

document.addEventListener('DOMContentLoaded', loadSearchHistory);
searchButton.addEventListener("click", getCityCoordinates, getWeatherDetails, createWeatherCard)