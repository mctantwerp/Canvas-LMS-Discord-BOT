
const helperFunctions = require("./functions.js");
const bot = require("./initBot.js");


//we use env file for secret tokens
require("dotenv").config();


//Api url
const apiUrl = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49719";
const apiUrl2 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_9656";
const apiKey = process.env.CANVAS_API;
const samApiKey = process.env.SAM_API_KEY;

const requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${samApiKey}`
    }
};

const client = bot.initBot();

helperFunctions.apiCall(apiUrl2, requestOptions, client);



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
