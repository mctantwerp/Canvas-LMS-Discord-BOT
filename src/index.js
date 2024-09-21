const bot = require("./initBot.js");
const client = bot.initBot();
const API = require("./APICalls.js");

//we use env file for secret tokens
require("dotenv").config();



const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");


//Api urls
const apiUrl = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49719";
const apiUrl2 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_9656";
const apiUrl3 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49715";

//when the bot is ready, execute the following code
client.on("ready", async () => {
  console.log(`Bot is online.`);

  const message = await API.canvasAPICall(apiUrl3, requestOptions.basic, client);
  await announcementHandler.sendMessageToChannel(client, message, process.env.ANNOUNCEMENT_CHANNEL_ID);

  // //DB stuff
  // const db = await require("./initDB.js").createDbConnection();
  // const result = await helperFunctions.checkAnnouncementExists(db);
  // console.log(result);
});





//when the bot receives a message, it will respond with "pong"
client.on("messageCreate", (message) => {
  console.log(message.content);
  if (message.content === "ping") {
    message.reply("pong");
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
