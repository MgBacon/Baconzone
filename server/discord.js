require('dotenv').config();
//var database=require('./server/router/API');
var Discord = require("discord.js");
var client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});
client.login(process.env.DISCORD_TOKEN);

function checkIfInGuild(guildID){
    return client.guilds.contains(guildID);
}
function checkGuildForSubs(guildID){
    var guild=client.guilds.get(guildID);
}
function checkChannelForSubs(channelID){
    //database.
}

module.exports=client;