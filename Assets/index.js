const cityInput = document.querySelector('.city-input')
const searchButton = document.querySelector(".search-btn")
const API_KEY = "";

const getCityCoordinates = () =>{
  const cityName = cityInput.value.trim(); 
  if(!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
  // console.log(cityName)
}

searchButton.addEventListener("click", getCityCoordinates)