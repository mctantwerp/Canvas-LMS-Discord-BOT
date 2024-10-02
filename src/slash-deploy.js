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
            name: course.name, // This should be a string
            value: course.course_id.toString(), // Ensure value is a string
        }))

        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                //COMMAND TO GET LATEST ANNOUNCEMENT WITH USER INPUT AND SUGGESTIONS

                // new SlashCommandBuilder()
                //     .setName('get_latest_announcement')
                //     .setDescription('Get the latest announcement of a specific course!')
                //     .addIntegerOption(option => {
                //         option.setName("course_id")
                //             .setDescription("The ID of a course, found in the URL of the course page.")
                //             .setRequired(true)
                //             .addChoices(courses); // Add the choices to the option

                //         return option; // Return the option after adding choices
                //     }),

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