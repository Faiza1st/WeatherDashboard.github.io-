const apiKey = '86c3a0fb434b92670d7d224f638b19fe';
const searchForm = document.getElementById('searchForm');
const weatherInfo = document.getElementById('weatherInfo');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('searchInput').value;
    getWeatherData(city);
});

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = 'Error fetching weather data';
        });
}

function displayWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;

    const weatherHTML = `
                <h2>${cityName}</h2>
                <p>Temperature: ${temperature} K</p>
                <p>Description: ${description}</p>
            `;

    weatherInfo.innerHTML = weatherHTML;
}