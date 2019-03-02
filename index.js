require('dotenv').config();
const fetch = require('node-fetch');
const SlackBot = require('slackbots');
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
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    
    // fetchLatAndLong('goteborg').then(response => response.json()).then(latData => {
    //     fetchWeather(getLatAndLngFromRes(latData)).then(response => response.json()).then(weatherData => {
    //         console.log(weatherData.currently);
    //     });
    // });

    let dude = chooseRandomPerson();
    let randomcomplaint = getRandomComplaint();
    // let losertext = `todays looser is: ${dude}, congratulations, how do you feel?`;
    // if(dude == "peter"){
    //     losertext = `todays winner is ${dude}, congratulations! how do you feel?`;
    // }
    // bot.postMessageToChannel('fuck-shit-up', randomcomplaint, params);
    // bot.postMessageToChannel('fuck-shit-up', losertext, params);
});






// bot.on('message', msg => {
//     console.log(msg.text);
//     switch (msg.type) {
//         case 'message':
//         console.log(msg);
//             if (msg.channel[0] === 'fuck-shit-up' && msg.bot_id === undefined) {
//                 console.log("YIKES");
//                 if (msg.text.split(':')[0] == 'weather') {
//                     let city = msg.text.split(':')[1];
//                     reportWeatherFromCity(city, msg.user);
//                 }
//             }
//     }
// })

bot.on('message', msg => {
    console.log(msg);
    switch(msg.type) {
        case 'message':
        console.log(msg.text);
    }
})


function reportWeatherFromCity(city, userId) {
    let currentweather;
    // let users = bot.getUsers();
    // let user;
    // users._value.members.find(e => {
    //     if (e.id === userId) {
    //         user = e.profile;
    //     }
    // });
    // console.log(user);

    fetchLatAndLong(city).then(response => response.json()).then(latData => {
        console.log("fetched lat long");
        fetchWeather(getLatAndLngFromRes(latData)).then(response => response.json()).then(weatherData => {
            currentweather = `${weatherData.currently.summary}, ${weatherData.currently.temperature}°C`;
            bot.postMessageToChannel('fuck-shit-up', currentweather + ' bitch', params);
            //bot.postMessageToUser(user.display_name, currentweather + ' bitch', params);
        });
    });
}

function chooseRandomPerson() {
    let grabben = grabbarna[Math.floor(Math.random() * grabbarna.length)];
    return grabben;
}

function getRandomComplaint() {
    let complaint = wordList[Math.floor(Math.random() * wordList.length)];
    return complaint;
}

const grabbarna = [
    'peter',
    'chris',
    'oskars',
    'alex',
    'elias',
    'virre',
    'nils'
]


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