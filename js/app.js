"use strict";
const apiKey = 'd367d2b32c6effdcff8407f35c63c1d7';
const apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lang=eng&appid=' + apiKey + '&q=';
const iconUrl = 'http://openweathermap.org/img/w/';


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getMinTemp(array){
    let min_temp = array[0];
    for(let i = 0; i < array.length; i++){
        if (array[i] < min_temp){
            min_temp = array[i];
        }
    }
    return min_temp;
}

function getMaxTemp(array){
    let max_temp = array[0];
    for(let i = 0; i < array.length; i++){
        if (array[i] > max_temp){
            max_temp = array[i];
        }
    }
    return max_temp;
}

function datetimeToDay(datetime){
    datetime *= 1000;
    const day = new Date(datetime);
    const dayName = days[day.getDay()];
    return dayName;
}

function searchWeather(event, decider="null"){
    event.preventDefault();
    var render = document.getElementById("render");
    var e = render.lastElementChild;
    while(e){
        render.removeChild(e);
        e = render.lastElementChild;
    }
    let city = "";
    if (decider === "null"){
        city = document.getElementById("city-title").value;
    } else{
        city = decider;
    }
    const url = apiUrl + city;
    fetch(url)
        .then((res) => res.json())
        .then((data) => handleData(data))
        .catch((error) => console.error(error));
}

function getTime(datetime){
    datetime *= 1000;
    let time = new Date(datetime);
    let hour = time.getHours();
    let minutes = time.getMinutes();
    return hour + ":" + minutes;
}

function handleData(data){
    const cityName = data.city.name;
    const countryName = data.city.country;
    const sunset = getTime(data.city.sunset);
    
    let realData = [];

    let todayData = [];
    let temps = [];
    data.list.forEach(element =>{
        temps.push(element.main.temp);
    });
    console.log(getMinTemp(temps.slice(0, 8)));

    let i = 0;
    data.list.forEach(element => {
        while(i < 8){
            todayData.push({
                desc: element.weather[0].main,
                icon: iconUrl + element.weather[0].icon + ".png",
                temp: Math.floor(element.main.temp),
                mintemp: Math.floor(getMinTemp(temps.slice(0, 8))),
                maxtemp: Math.floor(getMaxTemp(temps.slice(0, 8))),
                humidity: element.main.humidity,
                pressure: element.main.pressure,
                clouds: element.clouds.all,
                feelslike: Math.floor(element.main.feels_like)
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
                mintemp: Math.floor(getMinTemp(temps.slice(i, i + 8))),
                maxtemp: Math.floor(getMaxTemp(temps.slice(i, i + 8))),
                clouds: element.clouds.all
            });
        }
        i += 1;
    });
    
    renderWeek(realData, cityName);
    renderDay(todayData, cityName, countryName, sunset);
}

//array is an array of 8 temperatures of the day
function getCurrentTemp(array){
    let currentTime = new Date();
    let hour = currentTime.getHours();
    for(let i = 0; i < 24; i++){
        if (i <= hour && hour <= i + 3){
            return array[Math.floor(i/3)];
        }
    }
}

function pushElement(thing, from){
    let to = [];
    from.forEach(element => {
        to.push(element[thing]);
    })
    return to;
}

function renderDay(todayData, cityName, countryName, sunset){
    console.log(todayData);
    document.getElementById("today-date").innerText = (new Date()).toDateString();

    let todayIcons = pushElement("icon", todayData);
    let todayDesc = pushElement("desc", todayData);
    document.getElementById("desc").innerHTML = "<img src='"+ getCurrentTemp(todayIcons) 
                                    + "'>" + getCurrentTemp(todayDesc);

    let todayTemps = pushElement("temp", todayData);
    document.getElementById("today-temp").innerText = getCurrentTemp(todayTemps) + "°C";

    document.getElementById("location").innerText = cityName + ", " + countryName;

    let todayFeelsLike = pushElement("feelslike", todayData);
    document.getElementById("feelslike").innerText = "Feels like " + getCurrentTemp(todayFeelsLike) + "°C";

    let todayPressure = pushElement("pressure", todayData);
    document.getElementById("pressure").innerText = getCurrentTemp(todayPressure) + "pa";

    let todayClouds = pushElement("clouds", todayData);
    document.getElementById("clouds").innerHTML = getCurrentTemp(todayClouds) + "% <i class='fas fa-cloud'></i>";
}

function renderWeek(weekData, cityName){
    document.getElementById("city").innerText = cityName;
    console.log(weekData);
    let parentDiv = document.getElementById("render");
    weekData.forEach(element => {
        let div = document.createElement("div");
        div.className = "row my-2 align-items-center";
        
        let title = document.createElement("h4");
        title.innerText = element.date;
        title.className = "col-3 fw-light"
        div.appendChild(title);

        let min_temp = document.createElement("p");
        min_temp.innerHTML = "<i class='fas fa-temperature-low'></i> " + element.mintemp + "°C";
        min_temp.className = "col-3 fw-bold"
        div.appendChild(min_temp);

        let max_temp = document.createElement("p");
        max_temp.innerHTML = "<i class='fas fa-temperature-high'></i> " + element.maxtemp + "°C";
        max_temp.className = "col-3 fw-bold"
        div.appendChild(max_temp);


        let clouds = document.createElement("p");
        clouds.innerHTML = "<i class='fas fa-cloud'></i> " + element.clouds + "%";
        clouds.className = "col-3"
        div.appendChild(clouds);

        parentDiv.appendChild(div);
    })
}