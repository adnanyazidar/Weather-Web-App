// Define weather icons mapping
const weatherIcons = {
  0: {
    name: "Clear sky",
    image: "./images/icons/clear-day.svg",
  },
  1: {
    name: "Mainly clear",
    image: "./images/icons/clear-day.svg",
  },
  2: {
    name: "Partly cloudy",
    image: "./images/icons/partly-cloudy-day.svg",
  },
  3: {
    name: "Overcast",
    image: "./images/icons/overcast.svg",
  },
  45: {
    name: "Fog",
    image: "./images/icons/fog.svg",
  },
  48: {
    name: "Depositing rime fog",
    image: "./images/icons/fog.svg",
  },
  51: {
    name: "Drizzle: Light intensity",
    image: "./images/icons/drizzle.svg",
  },
  53: {
    name: "Drizzle: Moderate intensity",
    image: "./images/icons/drizzle.svg",
  },
  55: {
    name: "Drizzle: Dense intensity",
    image: "./images/icons/drizzle.svg",
  },
  56: {
    name: "Freezing Drizzle: Light intensity",
    image: "./images/icons/freezing-drizzle.svg",
  },
  57: {
    name: "Freezing Drizzle: Dense intensity",
    image: "./images/icons/freezing-drizzle.svg",
  },
  61: {
    name: "Rain: Slight intensity",
    image: "./images/icons/rain.svg",
  },
  63: {
    name: "Rain: Moderate intensity",
    image: "./images/icons/rain.svg",
  },
  65: {
    name: "Rain: Heavy intensity",
    image: "./images/icons/heavy-rain.svg",
  },
  66: {
    name: "Freezing Rain: Light intensity",
    image: "./images/icons/rain.svg",
  },
  67: {
    name: "Freezing Rain: Heavy intensity",
    image: "./images/icons/rain.svg",
  },
  71: {
    name: "Snow fall: Slight intensity",
    image: "./images/icons/snow.svg",
  },
  73: {
    name: "Snow fall: Moderate intensity",
    image: "./images/icons/snow.svg",
  },
  75: {
    name: "Snow fall: Heavy intensity",
    image: "./images/icons/heavy-snow.svg",
  },
  77: {
    name: "Snow grains",
    image: "./images/icons/snow-grains.svg",
  },
  80: {
    name: "Rain showers: Slight",
    image: "./images/icons/drizzle.svg",
  },
  81: {
    name: "Rain showers: Moderate",
    image: "./images/icons/rain.svg",
  },
  82: {
    name: "Rain showers: Violent",
    image: "./images/icons/rain.svg",
  },
  85: {
    name: "Snow showers: Slight",
    image: "./images/icons/snow.svg",
  },
  86: {
    name: "Snow showers: Heavy",
    image: "./images/icons/heavy-snow.svg",
  },
  95: {
    name: "Thunderstorm: Slight or moderate",
    image: "./images/icons/thunderstorms.svg",
  },
  96: {
    name: "Thunderstorm with slight hail",
    image: "./images/icons/thunderstorms-rain.svg",
  },
  99: {
    name: "Thunderstorm with heavy hail",
    image: "./images/icons/thunderstorms-rain.svg",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // Theme management
  const themeButton = document.getElementById("theme-button");
  const themeMenu = document.getElementById("theme-menu");
  const themeIcon = document.getElementById("theme-icon");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.textContent = "🌙";
    } else if (theme === "light") {
      document.body.classList.remove("dark-mode");
      themeIcon.textContent = "☀️";
    } else if (theme === "os-default") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        document.body.classList.add("dark-mode");
        themeIcon.textContent = "🌙";
      } else {
        document.body.classList.remove("dark-mode");
        themeIcon.textContent = "☀️";
      }
    } else if (theme === "auto") {
      applyAutoTheme();
    } else {
      // Default to light
      document.body.classList.remove("dark-mode");
      themeIcon.textContent = "☀️";
    }
  }

  function applyAutoTheme() {
    const currentHour = new Date().getHours();
    const theme = currentHour >= 6 && currentHour < 18 ? "light" : "dark";
    applyTheme(theme);
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme") || "auto";
    applyTheme(savedTheme);
  }

  applySavedTheme();

  themeButton.addEventListener("click", () => {
    themeMenu.classList.toggle("hidden");
  });

  document.getElementById("theme-os-default").addEventListener("click", () => {
    localStorage.setItem("theme", "os-default");
    applyTheme("os-default");
    themeMenu.classList.add("hidden");
  });

  document.getElementById("theme-light").addEventListener("click", () => {
    localStorage.setItem("theme", "light");
    applyTheme("light");
    themeMenu.classList.add("hidden");
  });

  document.getElementById("theme-dark").addEventListener("click", () => {
    localStorage.setItem("theme", "dark");
    applyTheme("dark");
    themeMenu.classList.add("hidden");
  });

  setInterval(() => {
    const savedTheme = localStorage.getItem("theme") || "auto";
    if (savedTheme === "auto") {
      applyAutoTheme();
    }
  }, 3600000);

  function initializeDate() {
    const currentDateElement = document.getElementById("current-date");
    const today = new Date();
    currentDateElement.setAttribute(
      "datetime",
      today.toISOString().split("T")[0]
    );
    currentDateElement.textContent = dateFormattedFull(today);
  }

  function dateFormattedFull(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  }

  function updateTimeAndGreeting() {
    const timeElement = document.getElementById("time");
    const greetingElement = document.getElementById("greeting");

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    timeElement.textContent = `${hours}:${minutes}`;

    let greeting = "";
    if (hours < 12) {
      greeting = "Good Morning";
    } else if (hours < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
    greetingElement.textContent = greeting;
  }

  initializeDate();
  updateTimeAndGreeting();
  setInterval(updateTimeAndGreeting, 1000);

  // Weather functions
  async function getWeatherByCity() {
    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    document.getElementById("fetch-loading").style.display = "block";

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=10&language=en&format=json`
      );
      const responseJson = await response.json();

      if (!responseJson.results || responseJson.results.length === 0) {
        alert("City not found");
        document.getElementById("fetch-loading").style.display = "none";
        return;
      }

      const { latitude, longitude, name: cityName } = responseJson.results[0];

      localStorage.setItem("cityName", cityName);
      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);

      document.getElementById("city-heading").textContent = cityName;
      document.getElementById(
        "city-name"
      ).textContent = `Weather in ${cityName}`;
      cityInput.value = "";

      await getWeather(latitude, longitude);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again.");
    } finally {
      document.getElementById("fetch-loading").style.display = "none";
    }
  }

  document
    .getElementById("search-button")
    .addEventListener("click", getWeatherByCity);

  async function getWeather(latitude, longitude) {
    await Promise.all([
      fetchDailyWeather(latitude, longitude),
      fetchHourlyWeather(latitude, longitude),
      fetchWeatherDataUV(latitude, longitude),
      fetchWeatherDataPollution(latitude, longitude),
      fetchCurrentWeather(latitude, longitude),
    ]);
  }

  async function fetchDailyWeather(latitude, longitude) {
    const dailyTempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`;

    try {
      const response = await fetch(dailyTempUrl);
      const data = await response.json();

      const weatherCardsContainer = document.getElementById("weather-cards");
      weatherCardsContainer.innerHTML = "";

      data.daily.time.forEach((date, index) => {
        const maxTemp = data.daily.temperature_2m_max[index];
        const weatherCode = data.daily.weather_code[index];
        const weatherDescription = weatherIcons[weatherCode]?.name || "Unknown";
        const weatherIcon =
          weatherIcons[weatherCode]?.image || "./images/icons/unknown.svg";

        weatherCardsContainer.innerHTML += `
          <article class="weather-card shadow-lg rounded-lg overflow-hidden p-6 text-center">
            <p class="text-gray-500 text-lg mb-4">${dateFormatted(
              new Date(date)
            )}</p> 
            <img src="${weatherIcon}" alt="${weatherDescription}" class="w-12 h-12 mx-auto mb-2">
            <p class="text-2xl font-bold">${Math.round(maxTemp)}°</p>
            <p class="text-sm text-gray-500">${weatherDescription}</p>
          </article>
        `;
      });
    } catch (error) {
      console.error("Error fetching daily weather data:", error);
    }
  }

  async function fetchHourlyWeather(latitude, longitude) {
    const hourlyTempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code`;

    try {
      const response = await fetch(hourlyTempUrl);
      const data = await response.json();

      const weatherCardsContainer =
        document.getElementById("weather-container");
      weatherCardsContainer.innerHTML = "";

      if (data && data.hourly && data.hourly.time) {
        const startIndex = data.hourly.time.findIndex(
          (time) => new Date(time).getHours() === 13
        );
        const selectedTimes = data.hourly.time.slice(
          startIndex,
          startIndex + 6
        );

        selectedTimes.forEach((time, index) => {
          const hour = new Date(time).getHours();
          const temperature = data.hourly.temperature_2m[startIndex + index];
          const weatherCode = data.hourly.weather_code[startIndex + index];
          const weatherDescription =
            weatherIcons[weatherCode]?.name || "Unknown";
          const weatherIcon =
            weatherIcons[weatherCode]?.image || "./images/icons/unknown.svg";

          weatherCardsContainer.innerHTML += `
            <article class="flex flex-col items-center justify-center w-full h-36 bg-white/30 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-md transition transform hover:scale-105">
              <p class="text-sm text-black">${hour} PM</p>
              <img src="${weatherIcon}" alt="${weatherDescription}" class="w-8 h-8 mb-2">
              <p class="text-3xl font-bold text-black">${Math.round(
                temperature
              )}°</p>
              <p class="text-sm text-black mt-1">${weatherDescription}</p>
            </article>
          `;
        });
      } else {
        console.error("Data from API is not structured as expected.");
      }
    } catch (error) {
      console.error("Error fetching hourly weather data:", error);
    }
  }

  async function fetchWeatherDataUV(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=sunrise,sunset,uv_index_max,uv_index_clear_sky_max&timezone=GMT`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const temperature = data.hourly.temperature_2m[0];
      const uvIndexMax = data.daily.uv_index_max[0];

      const feelsLikeElement = document.getElementById("feels-like");
      feelsLikeElement.textContent = `Feels like ${Math.round(temperature)}°`;

      const weatherStatusElement = document.getElementById("weather-status");
      weatherStatusElement.textContent =
        uvIndexMax > 5 ? "☀️ Sunny" : "☁️ Cloudy";
    } catch (error) {
      console.error("Failed to fetch UV index data:", error);

      const feelsLikeElement = document.getElementById("feels-like");
      feelsLikeElement.textContent = "Error fetching temperature data";

      const weatherStatusElement = document.getElementById("weather-status");
      weatherStatusElement.textContent = "Error fetching weather status";
    }
  }

  async function fetchWeatherDataPollution(latitude, longitude) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const aqi = data.current.european_aqi;

      const weatherAlertElement = document.getElementById("weather-alert");
      weatherAlertElement.textContent = `🚨 Air Quality Index: Current AQI is ${aqi}`;
    } catch (error) {
      console.error("Failed to fetch air quality data:", error);

      const weatherAlertElement = document.getElementById("weather-alert");
      weatherAlertElement.textContent =
        "🚨 Air Quality Index: Failed to fetch data";
    }
  }

  async function fetchCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m&daily=rain_sum,wind_speed_10m_max,wind_gusts_10m_max&timezone=GMT`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const temperature = data.current_weather.temperature;
      const windSpeed = data.current_weather.windspeed;
      const rain = data.daily.rain_sum[0];

      document.getElementById("temperatureP").textContent = `${Math.round(
        temperature
      )}°`;
      document.getElementById("wind-speed").textContent = `${windSpeed} mph`;
      document.getElementById("humidity").textContent = `${rain} mm`;

      document.getElementById("temperatureH3").textContent = `${Math.round(
        temperature
      )}°`;
      document.getElementById(
        "wind-speedKanan"
      ).textContent = `${windSpeed} mph`;
      document.getElementById("humidityKanan").textContent = `${rain} mm`;
    } catch (error) {
      console.error("Error fetching current weather data:", error);
    }
  }

  // Initialize weather data on page load
  const savedCity = localStorage.getItem("cityName");
  const savedLatitude = localStorage.getItem("latitude");
  const savedLongitude = localStorage.getItem("longitude");

  if (savedCity && savedLatitude && savedLongitude) {
    document.getElementById("city-heading").textContent = savedCity;
    getWeather(parseFloat(savedLatitude), parseFloat(savedLongitude));
  } else {
    getLocation();
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeather(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
});

function dateFormatted(date, locale = "id-ID", options = {}) {
  const defaultOptions = {
    weekday: "long",
  };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
}
