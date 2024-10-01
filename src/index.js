const bot = require("./initBot.js");
const client = bot.initBot();
const API = require("./APICalls.js");
const sendMessage = require("./sendMessageChannel.js");
const apiUrlGenerator = require("./apiUrlGenerator.js");
const courseHandler = require("./courseHandler.js");
const pollingFunctions = require("./pollingFunctions.js");
const reminderController = require("./reminder.js");

//we use env file for secret tokens
require("dotenv").config();

const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");
const pusherFunctions = require("./pusherFunctions.js");


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


  const apiUrlAssig = "https://canvas.kdg.be/api/v1/courses/49719/assignments";
  const apiData = await API.regularCanvasAPICall(apiUrlAssig, requestOptions.getLatestAnnouncementCall, client);
  // console.log(helperFunctions.announcementHTMLtoText(apiData));
  // pusherFunctions.sendDataToPi(apiData);


  await apiData.forEach(async(element) => {
    const reminderData = await reminderController.sendReminder(element);
    const reminderMessage = helperFunctions.announcementHTMLtoTextString(reminderData);
    sendMessage.sendMessageToChannel(client, reminderMessage, "1287211078249611287");    
    console.log(reminderMessage);
  });

  //generate course table information for all enrolled courses.
  await apiUrlGenerator.generateCourses(client, requestOptions.getEnrolledCourses, db);

  //poll for announcements
  //pollingFunctions.pollAnnouncements(db, requestOptions.getLatestAnnouncementCall, client);

  apiUrlGenerator.saveAssignmentsToDB(client, requestOptions.getUpcomingAssignments, db);
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

module.exports = {
  client,
};
