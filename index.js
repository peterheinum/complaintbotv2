require("dotenv").config();
const fetch = require("node-fetch");
const SlackBot = require("slackbots");
const graphGenerator = require("./Helpers/GraphGenerator");
const fs = require("fs");

const mapquest_key = process.env.MAPQUEST_KEY;
const mapquest_secret = process.env.MAPQUEST_SECRET;
const darksky_key = process.env.DARKSKY_KEY;

// create a bot
const envKey = process.env.KEY;
const bot = new SlackBot({
  token: envKey,
  name: "complaintbotv2"
});

const params = {
  icon_emoji: ":partly_sunny_rain:"
};

const isItMonday = () => {
  return new Date().getDay() == 1 ? true : false;
};

bot.on("start", function () {
  console.log("Goodmorning bitch");
  isItMonday() ? fetchForecast("stockholm") : fetchDailyPrognosis("stockholm");
});

fetchDailyPrognosis = location => {
  fetch(`http://weatherbackend.herokuapp.com/api/raw/${location}/C`)
    .then(res => res.json())
    .then(weatherData => {
      //if(weatherData.alerts) bot.postMessageToChannel('fuck-shit-up', `todays weather contains a warning, check ${weatherData.alerts.uri} for details`, params);
      console.log(weatherData.hourly.data)

      const arr = weatherData.hourly.data.reduce((acc, val) => {
        acc.push({ time: convertUnixToTime(val.time), temp: val.apparentTemperature });
        return acc;
      }, []);

      graphGenerator.createDailyGraph(arr);
    });
};

convertUnixToTime = unix_time => {
  let date = new Date(unix_time * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  return hours + ":" + minutes.substr(-2);
};

let lastmessage = "";
bot.on("message", msg => {
  switch (msg.type) {
    case "message":
      if (msg.text != lastmessage) {
        lastmessage = msg.text;
        if (msg.text.split(":")[0] == "weather") {
          let city = msg.text.split(":")[1];
          reportWeatherFromCity(city, msg.user);
        }
        if (msg.text.split(":")[0] == "forecast") {
          let location = msg.text.split(":")[1];
          fetchForecast(location);
        }
      }
  }
});

function reportWeatherFromCity(location, userId) {
  let user;
  if (userId != "") {
    user = getUser(userId);
  }
  fetch(`http://weatherbackend.herokuapp.com/api/currently/${location}/C`)
    .then(res => res.json())
    .then(weatherData => {
      let currentweather = `${weatherData.summary}, ${
        weatherData.Temperature
        }°C`;
      if (userId != "") {
        bot.postMessageToChannel(
          "fuck-shit-up",
          `${user.display_name} I gotchu bitch, ${currentweather}`,
          params
        );
      } else {
        bot.postMessageToChannel(
          "fuck-shit-up",
          `Daily weather report in stockholm ${currentweather}`,
          params
        );
      }
    });
  fetchDailyPrognosis(location);
}

function getUser(userId) {
  let users = bot.getUsers();
  let user;
  users._value.members.find(e => {
    if (e.id === userId) {
      user = e.profile;
    }
  });
  return user;
}

fetchForecast = location => {
  bot.postMessageToChannel(
    "fuck-shit-up",
    `Creating temperature graph for ${location}`,
    params
  );
  fetch(`http://weatherbackend.herokuapp.com/api/forecast/${location}/C`)
    .then(data => data.json())
    .then(result => {
      let arr = [];
      let weekArray = getWeekFromNow();
      result.map(e => {
        arr.push({
          day: weekArray[e.dayNr],
          max: e.temperatureMax,
          min: e.temperatureMin
        });
      });
      graphGenerator.generateForecastGraph(arr);
    });
};

getWeekFromNow = () => {
  let date = new Date();
  let counter = date.getDay();
  let start = date.getDay();
  let weekArray = [];
  let weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  for (let i = 0; i < 7; i++) {
    weekArray.push(weekday[counter]);
    counter++;
    if (counter == 7) {
      for (let j = 0; j < 7; j++) {
        weekArray.push(weekday[j]);
      }
    }
  }
  return weekArray;
};

function getLatAndLngFromRes(res) {
  let latLng;
  res.results.forEach(element => {
    element.locations.forEach(e => {
      latLng = `${e.latLng.lat},${e.latLng.lng}`;
    });
  });
  return latLng;
}

function fetchLatAndLong(city) {
  return fetch(
    `http://www.mapquestapi.com/geocoding/v1/address?key=${mapquest_key}&location=${city}, SE`
  );
}

function fetchWeather(latlng) {
  return fetch(
    `https://api.darksky.net/forecast/${darksky_key}/${latlng}?lang=sv&units=si`
  );
}
