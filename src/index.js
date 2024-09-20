const bot = require("./initBot.js");
const client = bot.initBot();

//we use env file for secret tokens
require("dotenv").config();


const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");


//Api urls
const apiUrl = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49719";
const apiUrl2 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_9656";


//when the bot is ready, execute the following code
client.on("ready", () => {
  helperFunctions.canvasAPICall(apiUrl, requestOptions.getLatestAnnouncementCall, client).then(message => {
    announcementHandler.sendMessageToChannel(client, "```" + message + "```", process.env.ANNOUNCEMENT_CHANNEL_ID);
  });
});



//when the bot receives a message, it will respond with "pong"
client.on("messageCreate", (message) => {
  console.log(message.content);
  if (message.content === "ping") {
    message.reply();
  } else if (message.content === "salam") {
    message.reply("aleikum ");
  } else if (message.content === "marco") {
    message.reply("polo");
  } else if (message.content === "lepel") {
    message.reply("tepel");
  }
});


module.exports = {
  client,
}
