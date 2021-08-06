//declaring elements for the form
var formEl=document.querySelector("#user-form");
var cityNameEl=document.querySelector("#city-name");
var submitBtn=document.querySelector("#search-btn");

var cityListEl=document.querySelector("#city-list");

//declaring elements for today's temperature
var weatherCurrentEl=document.querySelector("#today-weather");
var heading=document.querySelector("#current-heading");
var headingEl=document.querySelector("#heading-weather");
var ulEl=document.querySelector("#list");
var liTempEl=document.querySelector('#list-temp');
var liWindEl=document.querySelector('#list-wind');
var liHumidityEl=document.querySelector('#list-humidity');
var liUvEl=document.querySelector('#list-uv');


//function to display city name
var displayCity=function(cityName){
    var cityNameEl=document.createElement("button");
    cityNameEl.classList="list-item border-0  btn btn-secondary btn-lg m-3";
    cityNameEl.textContent=cityName;
    cityListEl.appendChild(cityNameEl);
    
    cityNameEl.addEventListener("click",function(){
        displayCityWeather(cityName);
    })
}


//array  for local storage
var cityArr=JSON.parse(localStorage.getItem('cityName')) || [];

//to save in local storage on btn click
var storeCity=function(cityName){
    cityArr.push(cityName);
    displayCity(cityName);
    localStorage.setItem("cityName",JSON.stringify(cityArr));
    cityNameEl.value=" ";
}
//function to display content from local storage
var displayContent=function(){
    let city=JSON.parse(localStorage.getItem("cityName"));
    if(city===null){
        city=[];
                   }
    else {
        for(var i=0;i<city.length;i++){
            displayCity(city[i]);
         }
   }
}
//for next five day temperature
var divFiveDay=document.querySelector("#five-day-weather");
var fiveEl=document.querySelector("#five-day");

//to display search history
var displayCityWeather=function(cityName){
	divFiveDay.innerHTML="";
    var apiUrl='https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=e983a933c2d7452a6356cb5595fe8cd4';
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            displayWeather(data);
        })
    })
}

//function to get weather from api
var getWeather=function(event){
    event.preventDefault();
    var cityName=cityNameEl.value.trim();
    var apiUrl='https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=e983a933c2d7452a6356cb5595fe8cd4';
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
		divFiveDay.innerHTML="";
            if(response.ok){
                displayWeather(data);
                storeCity(cityName);
            }
            else{
                alert("Please enter valid city name!");
                cityNameEl.value=" ";
            }
        })
    })
}

//display weather for a particular city
var displayWeather=function(data){
    //load icon
    var weatherCode=data.weather[0].icon;
    var icon="http://openweathermap.org/img/wn/"+weatherCode+".png";
    var imgEl=document.querySelector("#icon");
    imgEl.setAttribute("src",icon);
    heading.appendChild(imgEl);

    //for current weather
    weatherCurrentEl.classList="border p-2";
    headingEl.textContent=data.name+" ("+moment.unix(data.dt).format("MM/DD/YYYY")+")";
    liTempEl.textContent="Temp: "+data.main.temp+"° F";
    liWindEl.textContent="Wind: "+data.wind.speed+" MPH";
    liHumidityEl.textContent="Humidity: "+data.main.humidity+" %";



    //get UV index
    var uvIndexApi="https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&exclude=hourly,minutely&appid=a1ebf05a20a8fd712b4baf5c960acf21";
    fetch(uvIndexApi).then(function(response){
        response.json().then(function(data){
            liUvEl.textContent="UV index:";
            var uvIndex=data.current.uvi
            var p=document.createElement("p");
            p.textContent=+ uvIndex;
            liUvEl.appendChild(p);
            if(uvIndex<=2){
                p.classList="bg-success text-white px-2 rounded mx-1";
            }
            else if(uvIndex>2&&uvIndex<=5){
                p.classList=" ";
                p.classList="bg-warning text-white px-2 rounded mx-1";
            }
            else if(uvIndex>5&&uvIndex<=7){
                p.classList="orange text-white px-2 rounded mx-1";
            }
            else if(uvIndex>7&&uvIndex<=10){
                p.classList="bg-danger text-white px-2 rounded mx-1";
            }
            else if(uvIndex>10){
                p.classList="purple text-white px-2 rounded mx-1";
            }
        })
    })





//call function to display five day data
    var fiveDayApi="https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&units=imperial&APPID=a1ebf05a20a8fd712b4baf5c960acf21";
    fetch(fiveDayApi).then(function(response){
        response.json().then(function(data){
            fiveDayDisplay(data);
        })
    })
}
 //display five day weather
var fiveDayDisplay=function(data){
    fiveEl.textContent="5-Day Forecast:";
    for(var i=1;i<6;i++){
        var date=moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
        var divEl=document.createElement("div");
        divEl.classList="main-div m-3 p-3 border";
        var h4El=document.createElement("h4");
        h4El.textContent=date;
        divEl.appendChild(h4El);
        var imageIcon=data.daily[i].weather[0].icon;
        var icon="http://openweathermap.org/img/wn/"+imageIcon+".png";
        var imgEl=document.createElement("img");
        imgEl.setAttribute("src",icon);
        divEl.appendChild(imgEl);
        var arr=[data.daily[i].temp.day,data.daily[i].wind_speed,data.daily[i].humidity];
        var arrName=["Temp: ","Wind: ","Humidity: "];
        var arrSymbol=["° F"," MPH"," %"];
        for(var j=0;j<arr.length;j++){
            var pEl=document.createElement("p");
            pEl.textContent=arrName[j]+arr[j]+arrSymbol[j];
            divEl.appendChild(pEl);
        }
        divFiveDay.appendChild(divEl);

    }
}

//calling function 
displayContent();
formEl.addEventListener("submit",getWeather);