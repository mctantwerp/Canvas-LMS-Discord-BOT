const bot = require("./initBot.js");
const client = bot.initBot();
const mysql = require('mysql2/promise');

//we use env file for secret tokens
require("dotenv").config();

//DATABASE INIT CONNECTION
async function createDbConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  try {
    await connection.connect(); // Wait for the connection to be established
    console.log('Connected to MySQL database');
    return connection; // Return the connection for further use
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    throw error; // Rethrow the error to handle it elsewhere
  }
}


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


  //DB stuff
  const db = await createDbConnection();
  const result = await helperFunctions.checkAnnouncementExists(db);
  console.log(result);
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
