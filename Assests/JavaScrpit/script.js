const searchForm = document.getElementById('searchForm');
const weatherInfo = document.getElementById('weatherInfo');
const searchHistory = document.getElementById('searchHistory');
// API key Insert 
const apiKey = "86c3a0fb434b92670d7d224f638b19fe";
const historyLimit = 5;

// convert kelvin into fahrenheit
function kToF(kelvin) {
    return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
}

//convert  Meter Per Seconds to Mile Per Hours to get the temperature to MPH
function mpsToMph(mps) {
    return (mps * 2.23694).toFixed(2);
}

// Update the search history from the local storage 
function updateSearchHistory(city) {
    const existingHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const uniqueHistory = [...new Set([city, ...existingHistory])];
    const limitedHistory = uniqueHistory.slice(0, historyLimit);

    localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
    displaySearchHistory();
}
// Displays the search history from the local storage to the HTML Screach history element
function displaySearchHistory() {
    const historyItems = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = '<p>Search History:</p>';
    
    historyItems.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = city;
        
        // Add a click event listener to each history item
        historyItem.addEventListener('click', () => {
            getWeatherData(city);
        });
        
        searchHistory.appendChild(historyItem);
    });
}

function getWeatherData(city) {
    // Fetch current weather data from the website 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Display current weather from the data 
            displayWeather(data);
            // Fetch 5-day forecast data  from the website 
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(forecastData => {
            // Display 5-day forecast from the data 
            displayForecast(forecastData);
            updateSearchHistory(city);
        })
        // Display Error if user types something that is unsearchable
        .catch(error => {
            console.error('Error in weather data:', error);
            weatherInfo.innerHTML = 'Error in weather data';
        });
}

// Add a event listen to the submit button 
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('searchInput').value;
    getWeatherData(city);
});

displaySearchHistory();

// Add a event listen to the submit button 
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('searchInput').value;
    getWeatherData(city);
});

// function to show the current weather of the day. 
function displayWeather(data) {
    //Name of the City searched by user
    const cityName = data.name;
    //Current Temp
    const temperature = kToF(data.main.temp);
    //Discription of the temp 
    const description = data.weather[0].description;
    // Wind of the day 
    const windSpeed = mpsToMph(data.wind.speed);
    // what is the humidity like today 
    const humidity = data.main.humidity;

    const date = new Date();

    // DIsplay this in HTML
    const weatherHTML = `
        <h2>${cityName}, (${date.toDateString()})</h2>
        <p>Temperature: ${temperature} °F</p>
        <p>Description: ${description}</p>
        <p>Wind: ${windSpeed} MPH</p>
        <p>Humidity: ${humidity}%</p>
    `;

    weatherInfo.innerHTML = weatherHTML;
}

//Create a function for the 5 day forcast.
function displayForecast(forecastData) {
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);

    const forecastContainer = document.getElementById('forecastContainer');

    const forecastHTML = `
        <!-- Include a loop here to display forecast for each day -->
        ${forecastData.list
            .filter(day => new Date(day.dt * 1000).getDate() > currentDate.getDate()) // Filter starting from the next day
            .slice(0, 5) // Display only the next 5 days
            .map(day => {
                // Update nextDay for each iteration to get the correct date aka the current date of the week 
                nextDay.setDate(nextDay.getDate() + 1);

                return `
                    <div class="forecast-day">
                        <p>${nextDay.toDateString()}</p>
                        <p>Temperature: ${kToF(day.main.temp)} °F</p>
                        <p>Description: ${day.weather[0].description}</p>
                        <p>Wind: ${mpsToMph(day.wind.speed)} MPH</p>
                        <p>Humidity: ${day.main.humidity}%</p>
                        <hr>
                    </div>
                `;
            }).join('')}
    `;

    // Set the forecastHTML to the forecastContainer
    forecastContainer.innerHTML = forecastHTML;
}
