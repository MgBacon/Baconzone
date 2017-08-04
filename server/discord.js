require('dotenv').config();
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

module.exports=client;