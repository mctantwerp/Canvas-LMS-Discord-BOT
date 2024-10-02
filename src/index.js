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


//global variable for database
var db;


//when the bot is ready, execute the following code
client.on("ready", async () => {
  console.log(`Bot is online.`);
  //make connection to database
  db = await require("./initDB.js").createDbConnection();


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
  //command to get latest announcemenet
  if (interaction.isCommand()) {
    try {
      if (interaction.commandName === "get_latest_announcement") {

        //save userinput
        const course_id = interaction.options.getInteger("course_id");
        if (course_id <= 0) {
          return interaction.reply("Please enter a valid course ID.");

        }

        //create course api url
        const apiUrl = `${process.env.CANVAS_BASE_URL}/announcements?context_codes[]=course_${course_id}&per_page=1`;

        //use this api url for fetching announcements
        const announcement = await API.regularCanvasAPICall(apiUrl, requestOptions.basic, client);
        if (!announcement || announcement.length === 0) {
          return interaction.reply(`No announcements found for course ${course_id}`);
        }

        //transform announcement HTML to text
        const announcementHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(announcement[0].message);

        //get course name based on user inputted ID
        const course_name = await announcementHandler.fetchCourseNameById(course_id, db);

        //reply to user
        interaction.reply(`\`\`\`Title: ${announcement[0].title}\n\nDescription: ${announcementHTMLtoText}\n\nCourse: ${course_name}\n\nPosted by: ${announcement[0].user_name}\`\`\``);
      }
    } catch (error) {
      interaction.reply("An error occured.");
      console.log(error);
    }
  }
});

module.exports = {
  client,
};
