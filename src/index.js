
const helperFunctions = require("./functions.js");
const bot = require("./initBot.js");

const { Client, IntentsBitField } = require("discord.js");



//we use env file for secret tokens
require("dotenv").config();


//Api url
const apiUrl = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49719";
const apiKey = process.env.CANVAS_API;

const requestOptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
};

const client = bot.initBot();



//fetching data from the api
fetch(apiUrl, requestOptions)
    .then(response=> {
        if(!response.ok){
            throw new Error('Network response was not ok!');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        helperFunctions.handleData(data, client);
    })
    .catch(error =>{
        console.error('Error:', error);
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
