//we use env file for secret tokens
require("dotenv").config();
console.log(process.env.DISCORD_TOKEN);
const bot = require("./initBot.js");
const client = bot.initBot();
const API = require("./APICalls.js");
const sendMessage = require("./sendMessageChannel.js");
const apiUrlGenerator = require("./apiUrlGenerator.js");
const courseHandler = require("./courseHandler.js");
const pollingFunctions = require("./pollingFunctions.js");
const reminderController = require("./reminder.js");
const slashDeploy = require("./slash-deploy.js");

const axios = require('axios');


const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");
const { ChannelType, EmbedBuilder } = require("discord.js");
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
  // await apiUrlGenerator.generateCourses(client, requestOptions.getEnrolledCourses, db);


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
      await slashDeploy.slashRegister(db);
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
  //is it a command?
  if (interaction.isCommand()) {

    //GET LATEST ANNOUNCEMENT
    try {
      if (interaction.commandName === "get_latest_announcement") {

        // //save userinput --> ONLY IF USING USER INPUT FOR GET LATEST ANNOUNCEMENTS
        // const course_id = interaction.options.getInteger("course");
        // if (course_id <= 0) {
        //   return interaction.reply("Please enter a valid course ID.");
        // }

        //create course api url
        const course_id = interaction.options.getString("course_name");
        const apiUrl = `${process.env.CANVAS_BASE_URL}/announcements?context_codes[]=course_${course_id}&per_page=1`;

        //use this api url for fetching announcements
        const announcement = await API.regularCanvasAPICall(apiUrl, requestOptions.basic, client);
        if (!announcement || announcement.length === 0) {
          return interaction.reply({
            content: `No announcements found for course_id: ${course_id}`,
            ephemeral: true
          });
        }

        console.log(announcement);
        //transform announcement HTML to text
        const announcementHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(announcement[0].message);

        //get course name based on user inputted ID
        const course_name = await announcementHandler.fetchCourseNameById(course_id, db);

        //create embed -- constructor
        const embed = new EmbedBuilder()
          .setColor('e63f3b')
          .setTitle(`📢 -- ${announcement[0].title} `)
          .setDescription(`${announcementHTMLtoText}`)
          .addFields(
            { name: "Course Name", value: course_name, inline: true },
            { name: "Posted by", value: announcement[0].user_name, inline: true },
            { name: 'Link', value: announcement[0].html_url }
          )
          .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage

        //reply to user in ghost mode
        await interaction.reply({ embeds: [embed], ephemeral: true });

      }
    } catch (error) {
      interaction.reply("An error occured.");
      console.log(error);
    }

    //ADD CHANNEL TO COURSE
    try {
      if (interaction.commandName === "add_channel_to_course") {
        const courseId = interaction.options.getInteger('course_id');
        const courseName = interaction.options.getString('course_name');
        const channelDiscordId = interaction.options.getString('channel_discord_id');

        //get guild
        const guild = client.guilds.cache.get(process.env.SERVER_ID);

        //get all text channels of that guild
        const textChannels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).map(channel => ({
          id: channel.id
        }));

        //get all course IDs from Canvas
        const courses = await API.axiosCanvasAPICall(`${process.env.CANVAS_BASE_URL}/courses`, requestOptions.getEnrolledCourses, client);

        let courseFound = false;
        let channelFound = false;

        //check if course exists
        for (const course of courses) {
          if (course.id === courseId) {
            courseFound = true;
            break;
          }
        }

        // Check if Discord channel ID exists
        for (const textChannel of textChannels) {
          if (textChannel.id === channelDiscordId) {
            channelFound = true;
            break;
          }
        }

        // Handle saving only if both course and channel are found
        if (courseFound && channelFound) {
          const succesful = await courseHandler.saveCoursesWithNameAndDiscord(courseId, courseName, channelDiscordId, db);
          if (!succesful) {
            await interaction.reply(`An error occurred while saving the course to the database. Possible double entry?`);
          } else {
            await interaction.reply(`Course saved!\nCourse ID: ${courseId}\nCourse Name: ${courseName}\nChannel Discord ID: ${channelDiscordId}`);
          }
        } else {
          // Respond based on what was found
          let responseMessage = '';

          if (!courseFound) {
            responseMessage += `Course ID: ${courseId} does not exist in Canvas. Please provide a valid course id!\n`;
          }

          if (!channelFound) {
            responseMessage += `Discord channel ID: ${channelDiscordId} is not correct. Please provide a valid channel ID!\n`;
          }

          await interaction.reply(responseMessage.trim());
        }
      }
    } catch (error) {
      console.error('Error fetching courses or saving data:', error);
      await interaction.reply(`An error occurred while processing your request.`);
    }
  }
});

module.exports = {
  client,
};
