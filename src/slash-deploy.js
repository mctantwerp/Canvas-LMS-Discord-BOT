//we use env file for secret tokens
require("dotenv").config();
const courseHandler = require("./courseHandler.js");
const { REST, Routes, SlashCommandBuilder, ChannelType } = require('discord.js');

//info needed
const botToken = process.env.DISCORD_TOKEN;
const botID = process.env.BOT_ID;
const serverID = process.env.SERVER_ID;

const rest = new REST().setToken(botToken);

const slashRegister = async (db, client) => {
    try {

        //get all channels of server
        var guild = await client.guilds.fetch(process.env.SERVER_ID); // Fetch the guild
        var channels = await guild.channels.fetch(); // Fetch all channels in the guild

        //filter only text channels
        var textChannels = channels.filter(channel => channel.type === ChannelType.GuildText);

        //map the text channels to an array of objects
        var channelMap = await textChannels.map(channel => ({
            name: channel.name, //will be displayed to user
            value: channel.id.toString(), //will be returned value, used to process user input
        }));

        //get courses from database
        var courses = await courseHandler.getAllCourses(db);
        //mapping so it can be used in .addChoices()
        courses = await courses.map(course => ({
            name: course.name, //will be displayed to user
            value: course.course_id.toString(), //will be returned value
        }))

        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                //COMMAND TO GET LATEST ANNOUNCEMENT WITHOUT USER INPUT, ONLY SUGGESTIONS
                new SlashCommandBuilder()
                    .setName('get_latest_announcement') // Set the command name
                    .setDescription('Get the latest announcement of a specific course!') // Set the command description
                    .addStringOption(option => {
                        option.setName("course_name")
                            .setDescription("Select the course you want to get the latest announcement of.")
                            .setRequired(true) // This makes the option required
                            .addChoices(courses); // Use spread operator to add choices

                        return option; // Return the option after adding choices
                    }),
                //COMMAND TO GET UPCOMING ASSIGNMENT WITHOUT USER INPUT, ONLY SUGGESTIONS
                new SlashCommandBuilder()
                    .setName('get_upcoming_assignment') // Set the command name
                    .setDescription('Get an upcoming assignment of a specific course!') // Set the command description
                    .addStringOption(option => {
                        option.setName("course_name")
                            .setDescription("Select the course you want to get the upcoming assignment of.")
                            .setRequired(true) // This makes the option required
                            .addChoices(courses); // Use spread operator to add choices

                        return option; // Return the option after adding choices
                    }),


                //COMMAND TO ADD A CHANNEL TO A COURSE
                new SlashCommandBuilder()
                    .setName('add_channel_to_course') // Set the command name
                    .setDescription('Assign a specific channel to a course.') // Set the command description
                    .addStringOption(option =>
                        option.setName('course_id')
                            .setDescription('Enter the course ID')
                            .setRequired(true)
                            .addChoices(courses)
                    )
                    .addStringOption(option =>
                        option.setName('course_name')
                            .setDescription('Enter the course name')
                            .setRequired(true) //user must input the course name
                    )
                    .addStringOption(option =>
                        option.setName('channel_discord_id')
                            .setDescription('Enter the Discord channel ID')
                            .setRequired(true) //user must input the Discord channel ID
                            .addChoices(channelMap) //give user choices for channels
                    ),

                //GET ALL COURSES
                new SlashCommandBuilder()
                    .setName('get_all_courses')
                    .setDescription('Get all courses in a list!')

            ]
        });
        console.log('Commands registered successfully');
    } catch (error) {
        console.log("Error registering commands:", error);
    }
};



module.exports = {
    slashRegister
}