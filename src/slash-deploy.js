//we use env file for secret tokens
require("dotenv").config();
const courseHandler = require("./courseHandler.js");
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

//info needed
const botToken = process.env.DISCORD_TOKEN;
const botID = process.env.DISCORD_ID;
const serverID = process.env.SERVER_ID;

const rest = new REST().setToken(botToken);

const slashRegister = async (db) => {
    try {
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
                    .addIntegerOption(option =>
                        option.setName('course_id')
                            .setDescription('Enter the course ID')
                            .setRequired(true) // User must input the course ID
                    )
                    .addStringOption(option =>
                        option.setName('course_name')
                            .setDescription('Enter the course name')
                            .setRequired(true) // User must input the course name
                    )
                    .addStringOption(option =>
                        option.setName('channel_discord_id')
                            .setDescription('Enter the Discord channel ID')
                            .setRequired(true) // User must input the Discord channel ID
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