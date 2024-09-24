//we use env file for secret tokens
require("dotenv").config();

//using the package discord.js
const { Client, IntentsBitField } = require("discord.js");

function initBot() {
  //creating a new client
  //intents are used to specify what events the bot should listen to
  //in this case, the bot will listen to guilds, guild members, guild messages, and guild message content (guild in discord is a server)
  const client = new Client({
    intents: [
      IntentsBitField.Flags.GuildMessages,
    ],
  });

  //logs the bot in using the token
  client.login(process.env.DISCORD_TOKEN);

  //when the bot is ready, it will log "ready" to the console
  client.on("ready", (c) => {
    console.log(c.user.tag + " is ready!");
  });

  //returning the client
  return client;
}

module.exports = {
  initBot,
};
