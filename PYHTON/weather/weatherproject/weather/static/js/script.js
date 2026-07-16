function getWeather() {
    const city = document.getElementById('city').value;
    fetch(`/get_weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').innerHTML = `
                <h2>${data.city}</h2>
                <p>Temperature: ${data.temp}°C</p>
                <p>Condition: ${data.description}</p>
            `;
        });
}
