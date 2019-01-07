var SlackBot = require('slackbots');

// create a bot
const envKey = process.env.KEY;
var bot = new SlackBot({
    token: envKey, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'complaintbotv2'
});

bot.on('start', function () {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':japanese_ogre:'
    };

    let randomcomplaint = getRandomComplaint();
    bot.postMessageToChannel('fuck-shit-up', randomcomplaint, params);
    // define existing username instead of 'user_name'
    //bot.postMessageToUser('user_name', 'meow!', params); 

    // If you add a 'slackbot' property, 
    // you will post to another user's slackbot channel instead of a direct message
    //bot.postMessageToUser('user_name', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' }); 

    // define private group instead of 'private_group', where bot exist
    //bot.postMessageToGroup('private_group', 'meow!', params); 
});



bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data);
});

function getRandomComplaint() {
    let complaint = wordList[Math.floor(Math.random() * wordList.length)];
    return complaint;
}



wordList = [
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
    'Go fuck yourself'
]