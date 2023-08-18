const apiKey = "8de38b903a2b858c8071c6685d9e979f";
const weatherDataE1 = document.getElementById("weather-data");
const cityInputE1 = document.getElementById("city-input");
const formE1 = document.querySelector("form");
const forecastItemsE1 = document.querySelector(".forecast-items");

// Feature #1: Display current date and time
function displayCurrentDateAndTime() {
  const currentDate = new Date();
  const dayOfWeek = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const time = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateTimeElement = document.getElementById("current-date-time");
  dateTimeElement.textContent = `${dayOfWeek} ${time}`;
}

displayCurrentDateAndTime();

// Feature #2: Search engine for city names
formE1.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityValue = cityInputE1.value;
  await getWeatherData(cityValue);
  const cityNameElement = document.getElementById("city-name");
  cityNameElement.textContent = cityValue;
});

// Bonus Feature: Temperature conversion
const temperatureElement = document.getElementById("temperature");
const temperatureLinkElement = document.getElementById("temperature-link");

temperatureElement.textContent = "17 °C";

temperatureLinkElement.addEventListener("click", () => {
  const currentTemperature = parseFloat(temperatureElement.textContent);

  if (temperatureElement.textContent.includes("°C")) {
    const convertedTemperature = (currentTemperature * 9) / 5 + 32;
    temperatureElement.textContent = `${convertedTemperature.toFixed(2)} °F`;
  } else {
    const convertedTemperature = ((currentTemperature - 32) * 5) / 9;
    temperatureElement.textContent = `${convertedTemperature.toFixed(2)} °C`;
  }
});

async function getWeatherData(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    alert(
      `It is currently ${temperature}°C (${Math.round(
        (temperature * 9) / 5 + 32
      )}°F) in ${cityValue} with a humidity of ${humidity}%`
    );

    weatherDataE1.querySelector(
      ".icon"
    ).innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
    temperatureElement.textContent = `${temperature} °C`;
    weatherDataE1.querySelector(".description").textContent = description;

    const hourlyForecastData = await fetchHourlyForecast(cityValue);
    const filteredForecastData = filterHourlyForecast(hourlyForecastData);
    const formattedForecastData = formatHourlyForecast(filteredForecastData);
    renderHourlyForecast(formattedForecastData);
  } catch (error) {
    alert(
      `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${cityValue}`
    );
  }
}

async function fetchHourlyForecast(cityValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.list;
  } catch (error) {
    console.log("Error: ", error.message);
  }
}

function filterHourlyForecast(forecastData) {
  const currentDate = new Date();
  const filteredData = forecastData.filter((item) => {
    const itemDate = new Date(item.dt * 1000);
    return (
      itemDate.getDate() === currentDate.getDate() &&
      itemDate.getHours() >= currentDate.getHours()
    );
  });
  return filteredData.slice(0, 24);
}

function formatHourlyForecast(forecastData) {
  return forecastData.map((item) => {
    const temperature = Math.round(item.main.temp);
    const description = item.weather[0].description;
    const icon = item.weather[0].icon;
    const time = new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      temperature,
      description,
      icon,
      time,
    };
  });
}

function renderHourlyForecast(formattedForecast) {
  forecastItemsE1.innerHTML = "";

  formattedForecast.forEach((forecast) => {
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");

    const timeE1 = document.createElement("div");
    timeE1.classList.add("time");
    timeE1.textContent = forecast.time;

    const iconE1 = document.createElement("div");
    iconE1.classList.add("icon");
    iconE1.innerHTML = `<img src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather Icon">`;

    const temperatureE1 = document.createElement("div");
    temperatureE1.classList.add("temperature");
    temperatureE1.textContent = `${forecast.temperature} °C`;

    const descriptionE1 = document.createElement("div");
    descriptionE1.classList.add("description");
    descriptionE1.textContent = forecast.description;

    forecastItem.appendChild(timeE1);
    forecastItem.appendChild(iconE1);
    forecastItem.appendChild(temperatureE1);
    forecastItem.appendChild(descriptionE1);

    forecastItemsE1.appendChild(forecastItem);
  });
}

formE1.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityValue = cityInputE1.value;
  await getWeatherData(cityValue);
});
