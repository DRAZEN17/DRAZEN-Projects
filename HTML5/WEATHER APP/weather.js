document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "38245753586eeea339f5c330e7952348"; 

  const searchInput = document.getElementById("locationInput");
  const searchButton = document.getElementById("searchBtn");

  const cityElement = document.querySelector(".city");
  const temperatureElement = document.querySelector(".temperature");
  const descriptionElement = document.querySelector(".description");
  const humidityElement = document.querySelector(".humidity");
  const windSpeedElement = document.querySelector(".wind-speed");
  const weatherIcon = document.querySelector(".weather-icon i");

  const weatherIcons = {
    Clear: "fa-sun",
    Clouds: "fa-cloud",
    Rain: "fa-cloud-showers-heavy",
    Snow: "fa-snowflake",
    Drizzle: "fa-cloud-rain",
    Thunderstorm: "fa-bolt",
    Mist: "fa-smog",
    Haze: "fa-smog",
    Fog: "fa-smog",
    Smoke: "fa-smog",
    Dust: "fa-smog",
    Ash: "fa-smog",
    Squall: "fa-wind",
    Tornado: "fa-wind",
  };

  async function fetchWeather(city) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      const weather = data.weather[0];
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const wind = data.wind.speed;

      cityElement.textContent = data.name;
      temperatureElement.textContent = `${Math.round(temp)}°C`;
      descriptionElement.textContent = weather.description;
      humidityElement.textContent = `${humidity}% Humidity`;
      windSpeedElement.textContent = `${wind} km/h`;

      const iconClass = weatherIcons[weather.main] || "fa-sun";
      weatherIcon.className = `fa-solid ${iconClass}`;
    } catch (error) {
      alert("Location not found. Please try again.");
      console.error(error);
    }
  }

  searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  });

  // Default weather on page load
  fetchWeather("New York");
});
