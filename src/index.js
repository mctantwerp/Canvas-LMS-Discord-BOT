//we use env file for secret tokens
require("dotenv").config();
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
      //get current  date in US format
      var currentDate = new Date();
      currentDate = currentDate.toISOString().split('T')[0];

      await pollingFunctions.pollAnnouncements(db, requestOptions.getUpcomingAnnouncements(currentDate), client);
      await delay(5000);
      await pollingFunctions.pollAssignments(db, requestOptions.getUpcomingAssignments, client);
      await delay(5000);
      await slashDeploy.slashRegister(db);
      await delay(5000);
    }
  }
  slashDeploy.slashRegister(db);
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

        //create course api url
        const course_id = interaction.options.getString("course_name");
        const apiUrl = `${process.env.CANVAS_BASE_URL}/announcements?context_codes[]=course_${course_id}&per_page=1`;

        //get course name based on user inputted ID
        const course_name = await announcementHandler.getCourseNameById(course_id, db);

        //use this api url for fetching announcements
        const announcement = await API.regularCanvasAPICall(apiUrl, requestOptions.basic, client);

        if (!announcement || announcement.length === 0) {
          const embed = new EmbedBuilder()
            .setColor('e63f3b')
            .setTitle(`📢 -- No new announcements found! `)
            .setDescription(`Sadly, there have been no announcements found for this courses`)
            .addFields(
              { name: "Course Name", value: course_name, inline: true },
            )
            .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage

          //reply to user in ghost mode
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        //transform announcement HTML to text
        const announcementHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(announcement[0].message);

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
        return interaction.reply({ embeds: [embed], ephemeral: true });

      }
    } catch (error) {
      interaction.reply("An error occured.");
      console.log(error);
    }
    //GET UPCOMING ASSIGNMENT
    try {
      if (interaction.commandName === "get_upcoming_assignment") {

        //create course api url
        const course_id = interaction.options.getString("course_name");
        const apiUrl = `${process.env.CANVAS_BASE_URL}/courses/${course_id}/assignments?bucket=upcoming`;

        //get course name based on user inputted ID
        const course_name = await announcementHandler.getCourseNameById(course_id, db);

        //use this api url for fetching announcements
        const assignment = await API.regularCanvasAPICall(apiUrl, requestOptions.basic, client);


        //check if assignment is empty  
        if (!assignment || assignment.length === 0) {
          const embed = new EmbedBuilder()
            .setColor('e63f3b')
            .setTitle(`📝 -- No upcoming assignments found! `)
            .setDescription(`There have been no upcoming assignments found. Please keep in kind that the bot only filters on upcoming assignments, these are in a range of maximum 7 days.`)
            .addFields(
              { name: "Course Name", value: course_name, inline: true },
            )
            .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage

          //reply to user in ghost mode
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        //transform announcement HTML to text
        const assignmentHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(assignment[0].description);

        //create embed -- constructor
        const embed = new EmbedBuilder()
          .setColor('e63f3b')
          .setTitle(`📝 -- ${assignment[0].name} `)
          .setDescription(`${assignmentHTMLtoText}`)
          .addFields(
            { name: "Course Name", value: course_name, inline: true },
            { name: 'Link', value: assignment[0].html_url },
            { name: 'Due Date (US)', value: assignment[0].due_at ? Intl.DateTimeFormat('en-US').format(new Date(assignment[0].due_at)) : "No deadline given", inline: true },
          )
          .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage

        //reply to user in ghost mode
        return interaction.reply({ embeds: [embed], ephemeral: true });

      }
    } catch (error) {
      interaction.reply({ content: "An error occurred.", ephemeral: true });
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
            return interaction.reply({ content: `An error occurred while saving the course to the database. Possible double entry?` }, emphemeral = true);
          } else {
            return interaction.reply({ content: `Course saved!\nCourse ID: ${courseId}\nCourse Name: ${courseName}\nChannel Discord ID: ${channelDiscordId}` }, emphemeral = true);
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

          return interaction.reply({ content: responseMessage.trim(), ephemeral: true });
        }
      }
    } catch (error) {
      console.error('Error fetching courses or saving data:', error);
      await interaction.reply({ content: `An error occurred while processing your request.`, ephemeral: true });
    }

    //GET LIST OF ALL COURSES
    try {
      if (interaction.commandName === "get_all_courses") {
        const courses = await courseHandler.getAllCourses(db);
        const embed = new EmbedBuilder()
          .setColor('e63f3b')
          .setTitle(`👨‍🏫 -- All the courses! `)
          .addFields(
            { name: "Courses: ", value: courses.map(course => course.name).join('\n'), inline: true },
          )
          .setFooter({ text: 'The unofficial Canvas Bot!', iconURL: 'https://i.imgur.com/645X62y.png' }); // Correct usage

        //reply to user in ghost mode
        return interaction.reply({ embeds: [embed], ephemeral: true });

      }

    } catch (error) {
      console.log(error);

    }
  }
});

module.exports = {
  client,
};
