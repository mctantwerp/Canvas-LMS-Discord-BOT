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
                new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
            ]
        });
    } catch (error) {
        console.log(error);
    }
};
slashRegister();