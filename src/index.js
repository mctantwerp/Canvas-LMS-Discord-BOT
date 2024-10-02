const bot = require("./initBot.js");
const client = bot.initBot();
const API = require("./APICalls.js");
const sendMessage = require("./sendMessageChannel.js");
const apiUrlGenerator = require("./apiUrlGenerator.js");
const courseHandler = require("./courseHandler.js");
const pollingFunctions = require("./pollingFunctions.js");
const reminderController = require("./reminder.js");

const axios = require('axios');

//we use env file for secret tokens
require("dotenv").config();

const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");

//Api urls
const apiUrl = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49719";
const apiUrl2 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_9656&per_page=1";
const apiUrl3 = "https://canvas.kdg.be/api/v1/announcements?context_codes[]=course_49715";
//OR --> see function below

//when the bot is ready, execute the following code
client.on("ready", async () => {
  console.log(`Bot is online.`);
  //make connection to database
  const db = await require("./initDB.js").createDbConnection();


  // // //make api call to get the upcoming assignments by using requestOptions.getUpcomingAssignments
  //var data = await API.axiosCanvasAPICall("https://canvas.kdg.be/api/v1/courses/49722/assignments", requestOptions.getUpcomingAssignments, client);


  //generate course table information for all enrolled courses.
  //you can see we use requestOptions.getEnrolledCourses to get the enrolled courses, this is defined in requestOptions.js
  //we do this because canvas (if u fetch all courses of your account), will return all courses, including the ones you are not enrolled in anymore (e.g. first year courses)
  //this way we only get the courses you are currently enrolled in
  await apiUrlGenerator.generateCourses(client, requestOptions.getEnrolledCourses, db);


  //function to add delay
  function delay(ms) {
    //promise that resolves after specific milliseconds, this way we avoid the two polling functions interfering with each other. this could lead to some returns being null etc
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function runSequentialPolling() {
    while (true) {
      await pollingFunctions.pollAnnouncements(db, requestOptions.basic, client);
      await delay(5000);
      await pollingFunctions.pollAssignments(db, requestOptions.getUpcomingAssignments, client);
      await delay(5000);
    }
  }
  runSequentialPolling();


});

//when the bot receives a message, it will respond with "pong"
client.on("messageCreate", (message) => {
  //console.log(message.content);
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

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "ping") {

    }

  }
});

module.exports = {
  client,
};
