var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: '', // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'complaintbotv2'
});

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':japanese_ogre:'
    };
    
    // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
    bot.postMessageToChannel('general', "complaint", params);
    
    // define existing username instead of 'user_name'
    //bot.postMessageToUser('user_name', 'meow!', params); 
    
    // If you add a 'slackbot' property, 
    // you will post to another user's slackbot channel instead of a direct message
    //bot.postMessageToUser('user_name', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' }); 
    
    // define private group instead of 'private_group', where bot exist
    //bot.postMessageToGroup('private_group', 'meow!', params); 
});



bot.on('message', function(data) {
    // all ingoing events https://api.slack.com/rtm
    console.log(data);
});