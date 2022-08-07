const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefix = "~";

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply(`Pong. ${client.ws.ping}ms`);
  }
});

client.on('messageCreate', msg => {
  if (!msg.content.startsWith(prefix)) return;

  const commandName = msg.content.slice(prefix.length);

  switch (commandName) {
    case 'ping':
      msg.reply(`Pong. ${client.ws.ping}ms`)
        .then(() => console.log(`Got pinged by ${msg.author.username}`))
        .catch(console.error);
  }

});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
