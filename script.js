// Fixed coordinates for Nairobi (required in the exam)
const CITIES = {
    nairobi: { lat: -1.2864, lon: 36.8172 },
    mombasa: { lat: -4.0435, lon: 39.6682 },
    kisumu: { lat: -0.0917, lon: 34.7679 }
};

// Weather icons placeholder
function getWeatherIcon(code) {
    if (code >= 0 && code < 3) return "https://img.icons8.com/emoji/96/sun-emoji.png";        // sunny
    if (code >= 45 && code <= 48) return "https://img.icons8.com/emoji/96/fog-emoji.png";     // fog
    if (code >= 51 && code <= 67) return "https://img.icons8.com/emoji/96/cloud-emoji.png";   // cloudy
    if (code >= 80 && code <= 82) return "https://img.icons8.com/emoji/96/cloud-with-rain.png"; // rain
    return "https://img.icons8.com/emoji/96/cloud-emoji.png";
}

// DOM Elements
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const weatherResult = document.getElementById("weatherResult");
const errorMsg = document.getElementById("errorMsg");

// Weather fields
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");

// MAIN FUNCTION
async function fetchWeather() {
    const city = cityInput.value.trim().toLowerCase();

    // Clear UI
    errorMsg.classList.add("hidden");
    weatherResult.classList.add("hidden");

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (!CITIES[city]) {
        showError("City not found. Try Nairobi, Mombasa, or Kisumu.");
        return;
    }

    const { lat, lon } = CITIES[city];

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        loading.classList.remove("hidden");

        const response = await fetch(url);
        if (!response.ok) throw new Error("API Error");

        const data = await response.json();

        if (!data.current_weather) {
            throw new Error("Weather data unavailable");
        }

        // Update UI
        const w = data.current_weather;

        cityName.textContent = cityInput.value.trim();
        temp.textContent = w.temperature;
        wind.textContent = w.windspeed;
        icon.src = getWeatherIcon(w.weathercode);
        icon.alt = "Weather condition icon";

        weatherResult.classList.remove("hidden");
    } catch (err) {
        showError("Unable to fetch weather. Check your internet connection.");
    } finally {
        loading.classList.add("hidden");
    }
}

// Error display function
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
}

// Event Listeners
searchBtn.addEventListener("click", fetchWeather);

// Enter key support
cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") fetchWeather();
});
