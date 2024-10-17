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

async function getWeather() {
  const dailyTempUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-6.1818&longitude=106.8223&daily=weather_code,temperature_2m_max,temperature_2m_min";

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
            <p class="text-gray-500 text-lg mb-4">${dateFormatted(
              date
            )}</p> <!-- Menggunakan format nama hari saja -->
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

document.addEventListener("DOMContentLoaded", getWeather);
