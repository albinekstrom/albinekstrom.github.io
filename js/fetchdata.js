// fetchdata.js

// Exporterar en asynkron funktion för att hämta väderdata från SMHI Open Data API
export async function fetchWeatherData() {
  const response = await fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12/lat/57/data.json');
  const data = await response.json();

  // Hämtar väderprognosen från dataobjektet
  const tomorrowForecast = data.timeSeries[1];
  let temperature, weatherSymbolCode, precipitationCategory;
  
  console.log(tomorrowForecast);

  // Itererar över parametrarna för att extrahera temperatur, vädersymbol och nederbördskategori
  tomorrowForecast.parameters.forEach(param => {
    if (param.name === 't') {
      temperature = param.values[0];
    }
    if (param.name === 'Wsymb2') {
      weatherSymbolCode = param.values[0];
    }
    if (param.name === 'pcat') {
      precipitationCategory = param.values[0];
    }
  });

  // Returnerar de extraherade värdena som ett objekt
  return {
    temperature,
    weatherSymbolCode,
    precipitationCategory
  };
}
