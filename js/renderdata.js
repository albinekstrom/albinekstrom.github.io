// renderdata.js

// Importerar funktionen fetchWeatherData från fetchdata.js för att hämta väderdata
import { fetchWeatherData } from './fetchdata.js';

async function renderWeather() {
    // Hämtar väderdata för att få temperatur, vädersymbol och nederbördskategori
    const { temperature, weatherSymbolCode, precipitationCategory } = await fetchWeatherData();

    // Hämtar HTML-elementen för att visa temperatur, vädersymbol och vädermeddelande
    const temperatureElement = document.getElementById('temperature');
    const weatherIconElement = document.getElementById('weather-icon');
    const weatherMessageElement = document.getElementById('weather-message');

    console.log(temperature);
    console.log(weatherSymbolCode);
    console.log(precipitationCategory);

    // Uppdaterar temperaturens textinnehåll på sidan med den aktuella temperaturen
    temperatureElement.textContent = `${temperature}°C.`;

    // Väljer vädermeddelande beroende på om det kommer att bli nederbörd eller inte
    let weatherMessage;
    if (precipitationCategory > 0) {
        weatherMessage = "Vänta tills i övermorgon, då blir vädret bättre!";
    } else {
        weatherMessage = "Det blir bra väder! Vad väntar du på? Boka nu!";
    }
    weatherMessageElement.textContent = weatherMessage;

    // Väljer väderikon beroende på vädersymbolskoden och uppdaterar ikonen på sidan
    let iconPath;
    if (weatherSymbolCode < 4) {
        iconPath = 'images/sunshine.png';
    } else if (weatherSymbolCode >= 4 && weatherSymbolCode <= 8) {
        iconPath = 'images/clouds.png';
    } else {
        iconPath = 'images/heavy-rain.png';
    }
    weatherIconElement.src = iconPath;
}

// Kör renderWeather-funktionen när fönstret har laddats
window.onload = renderWeather;
