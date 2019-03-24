require('dotenv').config();
const fetch = require('node-fetch');
const SlackBot = require('slackbots');
const vega = require('vega');
const fs = require('fs');
const request = require('request');
const mapquest_key = process.env.MAPQUEST_KEY;
const mapquest_secret = process.env.MAPQUEST_SECRET;
const darksky_key = process.env.DARKSKY_KEY;

// create a bot
const envKey = process.env.KEY;
const bot = new SlackBot({
    token: envKey, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'complaintbotv2'
});

const params = {
    icon_emoji: ':japanese_ogre:'
};
console.log('Goodmorning bitch')

bot.on('start', function () {
    let randomcomplaint = getRandomComplaint();
    bot.postMessageToChannel('fuck-shit-up', randomcomplaint, params);
    fetchForecast("stockholm");
});



UploadGraphToSlack = () => {
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: envKey,
            title: "Image",
            filename: "stackedBarChart.png",
            filetype: "auto",
            channels: "#fuck-shit-up",
            file: fs.createReadStream('stackedBarChart.png'),
        },
    }, function (err, response) {
        console.log(JSON.parse(response.body));
    });
}



let lastmessage = "";
bot.on('message', msg => {
    switch (msg.type) {
        case 'message':
            if (msg.text != lastmessage) {
                lastmessage = msg.text;
                if (msg.text.split(':')[0] == 'weather') {
                    let city = msg.text.split(':')[1];
                    reportWeatherFromCity(city, msg.user);
                }
                if (msg.text.split(':')[0] == 'forecast') {
                    let location = msg.text.split(':')[1];
                    fetchForecast(location);
                }

            }
    }
})

function reportWeatherFromCity(location, userId) {
    let user;
    if (userId != "") {
        user = getUser(userId);
    }
    fetch(`http://weatherbackend.herokuapp.com/api/currently/${location}/C`).then(res => res.json()).then(weatherData => {
        let currentweather = `${weatherData.summary}, ${weatherData.Temperature}°C`;
        if (userId != "") {
            bot.postMessageToChannel('fuck-shit-up', `${user.display_name} I gotchu bitch, ${currentweather}`, params);
        } else {
            bot.postMessageToChannel('fuck-shit-up', `Daily weather report in stockholm ${currentweather}`, params);
        }
    });
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


function getRandomComplaint() {
    let complaint = wordList[Math.floor(Math.random() * wordList.length)];
    return complaint;
}



const wordList = [
    'Life is definitely not worth it.',
    'I regret waking up today.',
    'Come on shitheads do something productive.',
    'Remember that time I said I thought you were cool? I lied.',
    'Do you ever wonder what life would be like if you’d gotten enough oxygen at birth?',
    'Can you die of constipation? I ask because I’m worried about how full of shit you are.',
    'You’ll never be the man your mom is.',
    'Earth is full. Go home.',
    'Your family tree must be a cactus ‘cause you’re all a bunch of pricks.',
    'I was going to give you a nasty look but I see that you’ve already got one.',
    'Eat shit die',
    'Go fuck yourself',
    'Fuck TypeScript',
    `I'm on smoko, so leave me alone`,
    'Complaining never makes anything better.',
    'We are born crying, live complaining, and die disappointed.',
    'There are times in life when, instead of complaining, you do something about your complaints.',
    'You should do what you do best, join the garbage in the garbage can and be the trash you really are.'
]



fetchForecast = (location) => {
    bot.postMessageToChannel('fuck-shit-up', `Creating temperature graph for ${location}`, params);
    fetch(`http://weatherbackend.herokuapp.com/api/forecast/${location}/C`).then(data => data.json()).then(result => {
        let arr = [];
        let weekArray = getWeekFromNow();
        result.map(e => {
            arr.push({
                day: weekArray[e.dayNr],
                max: e.temperatureMax,
                min: e.temperatureMin,
            })
        });
        generateGraph(arr);
        console.log(arr);
    })
}

generateGraph = (data) => {
    let stackedBarChartSpec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 400,
        "height": 200,
        "padding": 5,

        "data": [
            {
                "name": "table",
                "values": [
                    { "category": data[0].day, "amount": ((data[0].max + data[0].min) / 2) },
                    { "category": data[1].day, "amount": ((data[1].max + data[1].min) / 2) },
                    { "category": data[2].day, "amount": ((data[2].max + data[2].min) / 2) },
                    { "category": data[3].day, "amount": ((data[3].max + data[3].min) / 2) },
                    { "category": data[4].day, "amount": ((data[4].max + data[4].min) / 2) },
                    { "category": data[5].day, "amount": ((data[5].max + data[5].min) / 2) },
                    { "category": data[6].day, "amount": ((data[6].max + data[6].min) / 2) },
                    { "category": data[7].day, "amount": ((data[7].max + data[7].min) / 2) },
                ]
            }
        ],

        "signals": [
            {
                "name": "tooltip",
                "value": {},
                "on": [
                    { "events": "rect:mouseover", "update": "datum" },
                    { "events": "rect:mouseout", "update": "{}" }
                ]
            }
        ],

        "scales": [
            {
                "name": "xscale",
                "type": "band",
                "domain": { "data": "table", "field": "category" },
                "range": "width",
                "padding": 0.05,
                "round": true
            },
            {
                "name": "yscale",
                "domain": { "data": "table", "field": "amount" },
                "nice": true,
                "range": "height"
            }
        ],

        "axes": [
            { "orient": "bottom", "scale": "xscale" },
            { "orient": "left", "scale": "yscale" }
        ],

        "marks": [
            {
                "type": "rect",
                "from": { "data": "table" },
                "encode": {
                    "enter": {
                        "x": { "scale": "xscale", "field": "category" },
                        "width": { "scale": "xscale", "band": 1 },
                        "y": { "scale": "yscale", "field": "amount" },
                        "y2": { "scale": "yscale", "value": 0 }
                    },
                    "update": {
                        "fill": { "value": "steelblue" }
                    },
                    "hover": {
                        "fill": { "value": "red" }
                    }
                }
            },
            {
                "type": "text",
                "encode": {
                    "enter": {
                        "align": { "value": "center" },
                        "baseline": { "value": "bottom" },
                        "fill": { "value": "#333" }
                    },
                    "update": {
                        "x": { "scale": "xscale", "signal": "tooltip.category", "band": 0.5 },
                        "y": { "scale": "yscale", "signal": "tooltip.amount", "offset": -2 },
                        "text": { "signal": "tooltip.amount" },
                        "fillOpacity": [
                            { "test": "isNaN(tooltip.amount)", "value": 0 },
                            { "value": 1 }
                        ]
                    }
                }
            }
        ]
    }


    // create a new view instance for a given Vega JSON spec
    var view = new vega
        .View(vega.parse(stackedBarChartSpec))
        .renderer('none')
        .initialize();

    // generate static PNG file from chart
    view
        .toCanvas()
        .then(function (canvas) {
            // process node-canvas instance for example, generate a PNG stream to write var
            //stream = canvas.createPNGStream();
            console.log('Writing PNG to file...')
            fs.writeFile('stackedBarChart.png', canvas.toBuffer(), function (err, result) {
                console.log("graph created, attempting upload");
                UploadGraphToSlack();
            })
        })
        .catch(function (err) {
            console.log("Error writing PNG to file:")
            console.error(err)
        });
}


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
        "Saturday",
    ];
    for (let i = 0; i < 7; i++) {
        weekArray.push(weekday[counter])
        counter++;
        if (counter == 7) {
            for (let j = 0; j < 7; j++) {
                weekArray.push(weekday[j]);
            }
        }
    }
    return weekArray;
}


function getLatAndLngFromRes(res) {
    let latLng;
    res.results.forEach(element => {
        element.locations.forEach(e => {
            latLng = `${e.latLng.lat},${e.latLng.lng}`
        });
    });
    return latLng;
}

function fetchLatAndLong(city) {
    return fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${mapquest_key}&location=${city}, SE`);
}

function fetchWeather(latlng) {
    return fetch(`https://api.darksky.net/forecast/${darksky_key}/${latlng}?lang=sv&units=si`);
}


