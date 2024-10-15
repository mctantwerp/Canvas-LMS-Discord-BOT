//we use env file for secret tokens
require("dotenv").config();
const bot = require("./initBot.js");
const client = bot.initBot();
const API = require("./APICalls.js");
const courseHandler = require("./courseHandler.js");
const pollingFunctions = require("./pollingFunctions.js");
const slashDeploy = require("./slash-deploy.js");
const embedBuilder = require("./embedBuilder.js");
const helperFunctions = require("./helperFunctions.js");
const announcementHandler = require("./announcementHandler.js");
const requestOptions = require("./requestOptions.js");
const { ChannelType } = require("discord.js");
var db;
//when the bot is ready, execute the following code
client.on("ready", async () => {
  console.log(`Bot is online.`);
  db = await require("./initDB.js").createDbConnection();

  //function to add delay
  function delay(ms) {
    //promise that resolves after specific milliseconds, this way we avoid the two polling functions interfering with each other. this could lead to some returns being null etc
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function runSequentialPolling() {
    while (true) {

      //get current date in US format, because canvas API uses this format
      var currentDate = new Date();
      currentDate = currentDate.toISOString().split('T')[0];
      //polls for new announcements of CURRENT date
      await pollingFunctions.pollAnnouncements(db, requestOptions.getUpcomingAnnouncements(currentDate), client);
      await delay(5000);
      //polls for assignments of UPCOMING --> within 7 days
      await pollingFunctions.pollAssignments(db, requestOptions.getFutureAssignments, client);
      await delay(5000);
      //register commands, needed for slash commands -- if user adds new course, then we need to register the new course for commands like /get_latest_announcement
      await slashDeploy.slashRegister(db);
      await delay(5000);
    }
  }
  runSequentialPolling();

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

        var announcementHTMLtoText;
        //transform announcement HTML to text
        if (!announcement || announcement.length === 0) {
          announcementHTMLtoText = "";
        }
        else {
          announcementHTMLtoText = await helperFunctions.announcementHTMLtoTextONLY(announcement[0].message);
        }

        //create embed -- constructor
        const embed = embedBuilder.createAnnouncementEmbed(announcement[0], course_name, announcementHTMLtoText);

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
        const apiUrl = `${process.env.CANVAS_BASE_URL}/courses/${course_id}/assignments`;

        //get course name based on user inputted ID
        const course_name = await announcementHandler.getCourseNameById(course_id, db);

        //use this api url for fetching announcements
        var assignment = await API.axiosCanvasAPICall(apiUrl, requestOptions.getFutureAssignments);


        //filter for assignments only in future, this is to counter assignments that are old but have no due_date which makes them still show up.
        assignment = assignment.filter(assignment => {
          const dueDate = new Date(assignment.due_at);
          return dueDate > new Date();
        })
        const embeds = [];

        if (Array.isArray(assignment) && assignment.length > 0) {
          // Create embed -- constructor
          for (const assig of assignment) {
            // Only pass the assignment message to helper if it exists
            const assignmentHTMLtoText = assig.description ? await helperFunctions.announcementHTMLtoTextONLY(assig.description) : "";
            console.log(assig);
            // Use createAssignmentEmbed which already handles empty cases
            const embed = embedBuilder.createAssignmentEmbed(assig, course_name, assignmentHTMLtoText);

            // Add the embed to the embeds array
            embeds.push(embed.toJSON());
          }
        } else {
          const embed = embedBuilder.createAssignmentEmbed(null, course_name, null);
          embeds.push(embed.toJSON());
        }

        // Reply to user in ghost mode with the embeds
        return interaction.reply({ embeds: embeds, ephemeral: true });
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

        //get all text channels of the guild
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
            return interaction.reply({ content: `An error occurred while saving the course to the database. Possible double entry?` }, ephemeral = true);
          } else {
            return interaction.reply({ content: `Course saved!\nCourse ID: ${courseId}\nCourse Name: ${courseName}\nChannel Discord ID: ${channelDiscordId}` }, ephemeral = true);
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
        //get all courses
        const courses = await courseHandler.getAllCourses(db);

        //create embed
        const embed = embedBuilder.createAllCoursesCommandEmbed(courses);

        //reply to user in ghost mode with the embed
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
