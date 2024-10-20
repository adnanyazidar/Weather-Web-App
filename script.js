const themeButton = document.getElementById("theme-button");
const themeMenu = document.getElementById("theme-menu");
const themeIcon = document.getElementById("theme-icon");

// Toggle dropdown visibility
themeButton.addEventListener("click", () => {
  themeMenu.classList.toggle("hidden");
});

// Theme change handlers
document.getElementById("theme-os-default").addEventListener("click", () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("theme", "os-default");
  themeIcon.textContent = "🌗";
  themeMenu.classList.add("hidden");
});

document.getElementById("theme-light").addEventListener("click", () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
  themeIcon.textContent = "☀️";
  themeMenu.classList.add("hidden");
});

document.getElementById("theme-dark").addEventListener("click", () => {
  document.body.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
  themeIcon.textContent = "🌙";
  themeMenu.classList.add("hidden");
});

// Set theme on load based on localStorage
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "🌙";
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    themeIcon.textContent = "☀️";
  } else {
    themeIcon.textContent = "🌗"; // OS Default
  }
});

function dateFormattedFull(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateFormatted = new Date(date);
  return dateFormatted.toLocaleDateString("id-ID", options);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentDateElement = document.getElementById("current-date");

  const today = new Date();

  currentDateElement.setAttribute(
    "datetime",
    today.toISOString().split("T")[0]
  );
  currentDateElement.textContent = dateFormattedFull(today);
});

async function getWeather(latitude, longitude) {
  const dailyTempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`;

  try {
    const response = await fetch(dailyTempUrl);
    const data = await response.json();

    console.log(data);

    const weatherCardsContainer = document.getElementById("weather-cards");

    weatherCardsContainer.innerHTML = "";

    data.daily.time.forEach((date, index) => {
      const maxTemp = data.daily.temperature_2m_max[index];
      const weatherDescription = getWeatherDescription(
        data.daily.weather_code[index]
      );

      weatherCardsContainer.innerHTML += `
          <article class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
            <p class="text-gray-500 text-lg mb-4">${dateFormatted(date)}</p> 
            <p class="text-2xl font-bold">${maxTemp}°</p>
            <p class="text-sm text-gray-500">${weatherDescription}</p>
          </article>
        `;
    });
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
}

function dateFormatted(date) {
  const options = {
    weekday: "long",
  };
  const dateFormatted = new Date(date);
  return dateFormatted.toLocaleDateString("id-ID", options);
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear",
    1: "Sunny",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Fog",
    48: "Foggy",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Heavy Rain Showers",
    82: "Violent Rain Showers",
  };

  return weatherCodes[code] || "Unknown";
}

document.addEventListener("DOMContentLoaded", getLocation);

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();

function formatDateCustom(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateFormatted = new Date(date);
  return dateFormatted.toLocaleDateString("id-ID", options);
}

const dailyTempCustom =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.1818&longitude=106.8223&daily=weather_code,temperature_2m_max,temperature_2m_min";

async function fetchWeatherDataCustom() {
  try {
    const response = await fetch(dailyTempCustom);
    const data = await response.json();

    const todayTemp = data.daily.temperature_2m_max[0];
    const weatherDescription = getWeatherDescriptionCustom(
      data.daily.weather_code[0]
    );

    document.getElementById("temperature").textContent = `${Math.round(
      todayTemp
    )}°`;
    document.getElementById("weather-description").textContent =
      weatherDescription;
  } catch (error) {
    console.log(error);
  }
}

function getWeatherDescriptionCustom(code) {
  const weatherCodes = {
    0: "Clear",
    1: "Sunny",
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "Fog",
    48: "Foggy",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Light Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Heavy Rain Showers",
    82: "Violent Rain Showers",
  };

  return weatherCodes[code] || "Unknown";
}

fetchWeatherDataCustom();
