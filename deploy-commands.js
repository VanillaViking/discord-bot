const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands})
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

