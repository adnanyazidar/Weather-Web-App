// Fungsi untuk mengubah tema berdasarkan waktu
function applyAutoTheme() {
  const currentHour = new Date().getHours(); // Dapatkan jam saat ini (0-23)

  if (currentHour >= 6 && currentHour < 18) {
    // Siang (06:00 - 18:00)
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    themeIcon.textContent = "☀️";
  } else {
    // Malam (18:00 - 06:00)
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    themeIcon.textContent = "🌙";
  }
}

// Atur tema secara otomatis saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  applyAutoTheme(); // Terapkan tema otomatis saat halaman dimuat

  // Periksa setiap jam apakah perlu mengubah tema
  setInterval(applyAutoTheme, 3600000); // Periksa tema setiap jam (3600000ms = 1 jam)
});

const themeButton = document.getElementById("theme-button");
const themeMenu = document.getElementById("theme-menu");
const themeIcon = document.getElementById("theme-icon");
themeButton.addEventListener("click", () => {
  themeMenu.classList.toggle("hidden");
});

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

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "🌙";
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    themeIcon.textContent = "☀️";
  } else {
    themeIcon.textContent = "🌗";
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

async function getWeatherByCity() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  document.getElementById("fetch-loading").style.display = "block";

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );
    const responseJson = await response.json();

    if (!responseJson.results || responseJson.results.length === 0) {
      alert("City not found");
      document.getElementById("fetch-loading").style.display = "none";
      return;
    }

    const latitude = responseJson.results[0].latitude;
    const longitude = responseJson.results[0].longitude;
    const cityName = responseJson.results[0].name;

    localStorage.setItem("cityName", cityName);
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    getWeather(latitude, longitude);

    document.getElementById("city-heading").innerHTML = cityName;

    document.getElementById("city-name").innerHTML = `Weather in ${cityName}`;

    document.getElementById("city").value = "";
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

document.addEventListener("DOMContentLoaded", () => {
  const savedCity = localStorage.getItem("cityName");
  const savedLatitude = localStorage.getItem("latitude");
  const savedLongitude = localStorage.getItem("longitude");

  if (savedCity && savedLatitude && savedLongitude) {
    document.getElementById("city-heading").innerHTML = savedCity;
    getWeather(savedLatitude, savedLongitude);
  } else {
    getLocation();
  }
});

async function getWeather(latitude, longitude) {
  const dailyTempUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`;

  try {
    const response = await fetch(dailyTempUrl);
    const data = await response.json();

    console.log(data);

    const weatherCardsContainer = document.getElementById("weather-cards");

    weatherCardsContainer.innerHTML = ""; // Kosongkan kontainer sebelum memasukkan data baru

    data.daily.time.forEach((date, index) => {
      const maxTemp = data.daily.temperature_2m_max[index];
      const weatherCode = data.daily.weather_code[index];
      const weatherDescription = weatherIcons[weatherCode]?.name || "Unknown";
      const weatherIcon = weatherIcons[weatherCode]?.image || "./images/icons/unknown.svg"; // Default ikon jika kode tidak ditemukan

      weatherCardsContainer.innerHTML += `
        <article class="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
          <p class="text-gray-500 text-lg mb-4">${dateFormatted(date)}</p> 
          <img src="${weatherIcon}" alt="${weatherDescription}" class="w-12 h-12 mx-auto mb-2">
          <p class="text-2xl font-bold">${maxTemp}°</p>
          <p class="text-sm text-gray-500">${weatherDescription}</p>
        </article>
      `;
    });
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
}

// Helper function to format date
function dateFormatted(date) {
  const options = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", options);
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
