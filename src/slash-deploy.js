//we use env file for secret tokens
require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');
//info needed
const botToken = process.env.DISCORD_TOKEN;
const botID = process.env.DISCORD_ID;
const serverID = process.env.SERVER_ID;

const rest = new REST().setToken(botToken);
const slashRegister = async () => {
    try {
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                new SlashCommandBuilder().setName('get_latest_announcement').setDescription('Get the latest announcement of a specific course!').addIntegerOption(option => {
                    return option.setName("course_id").setDescription("The ID of course, usually found in the URL in canvas").setRequired(true);
                }),
            ]
        });
    } catch (error) {
        console.log(error);
    }
};
slashRegister();