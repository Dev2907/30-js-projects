var key = "";

async function get_lat_long() {
  let cityname = document.getElementById("city").value;
  let geocoderUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname},&limit=1&appid=${key}`;
  let response = await fetch(geocoderUrl);
  response = await response.json();
  get_weather({"lat" : response[0].lat, "lon" : response[0].lon});
}

async function get_weather(loc_obj) {
  let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${loc_obj.lat}&lon=${loc_obj.lon}&appid=${key}&units=metric`;
  let response = await fetch(weatherURL);
  response = await response.json();
  update_page(response);
}

function update_page(weather_data){
  document.getElementById("temperature").innerHTML = `${weather_data['main']['temp']} &#8451;`
  document.getElementById("cityval").innerHTML = document.getElementById("city").value
  document.getElementById("humidity").innerHTML = `${weather_data['main']['humidity']} %`
  document.getElementById("wind").innerHTML = `${weather_data['wind']['speed']} m/s`
  img_url = ""
  switch(weather_data['weather']['main']){
    case "Thunderstorm":
    case "Rain":
      img_url = "./images/rain.png"
      break;
    case "Drizzle":
      img_url = "./images/drizzle.png"
      break;
    case "Snow":
      img_url = "./images/snow.png"
      break;
    case "Clear":
      img_url = "./images/mist.png"
      break;
    case "Clouds":
      img_url = "./images/clouds.png"
      break;
    default:
      img_url = "./images/clear.png"
      break;
  }
  debugger;
  document.getElementById("weather_icon").src = img_url
}