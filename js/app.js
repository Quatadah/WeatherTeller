"use strict";
const apiKey = 'd367d2b32c6effdcff8407f35c63c1d7';
const apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lang=eng&appid=' + apiKey + '&q=';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function datetimeToDay(datetime){
    datetime *= 1000;
    const day = new Date(datetime);
    const dayName = days[day.getDay()];
    return dayName;
}

function searchWeather(event){
    event.preventDefault();
    const city = document.getElementById("city-title").value;
    const url = apiUrl + city;
    fetch(url)
        .then((res) => res.json())
        .then((data) => handleData(data))
        .catch((error) => console.error(error));
}


function handleData(data){
    const cityName = data.city.name;
    let realData = [];

    let todayData = [];
    let i = 0;
    data.list.forEach(element => {
        while(i < 8){
            todayData.push({
                desc: element.weather[0].desc,
                temp: Math.floor(element.main.temp),
                mintemp: Math.floor(element.main.temp_max),
                maxtemp: Math.floor(element.main.temp_min),
                humidity: element.main.humidity,
                pressure: element.main.pressure,
                clouds: element.clouds.all
            });
            i += 1;
        }
    })
    i = 0;
    data.list.forEach(element => {
        if (i % 8 == 0){
            realData.push({
                date: datetimeToDay(element.dt),
                temp: Math.floor(element.main.temp),
                pressure: element.main.pressure,
                clouds: element.clouds.all
            });
        }
    });
    
    render(todayData, realData, cityName);
}

function render(todayData, weekData, cityName){
    document.getElementById("city").innerText = cityName;
    console.log(todayData);
}