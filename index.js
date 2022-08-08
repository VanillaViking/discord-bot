const { Client, GatewayIntentBits, ActionRowBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();
// Create a new client instance

//requires MessageContent, GuildMessages in intents to be able to receive and read messages 
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefix = "~";

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  tests: [Number], 
});

const User = mongoose.model('User', userSchema);



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

client.on('messageCreate', async msg => {
  if (!msg.content.startsWith(prefix)) return;

  const commandName = msg.content.slice(prefix.length);

  switch (commandName) {
    case 'ping':
      msg.reply(`Pong. ${client.ws.ping}ms`)
        .then(() => console.log(`Got pinged by ${msg.author.username}`))
        .catch(console.error);
      break;
    case 'typestart':

      await msg.reply(`typing test starting <t:${Math.floor(Date.now()/1000 + 10)}:R>`)
      break;

    case 'register':
      doc = await User.exists({discordId: msg.author.id})

      if (!(doc === null)) {
        msg.reply(`User ${msg.author.username} alreay exists.`);
        return;
      }

      let user = new User({discordId: msg.author.id, username: msg.author.username, tests: [98, 87, 100, 95]});
      user.save()
        .then(() => msg.reply(`Registered ${msg.author.username}.`))
        .catch((err) => {
          console.error(err);
          msg.reply(`Error.`);
        })
      break;

    case 'stats':
      doc = await User.exists({discordId: msg.author.id})

      if (doc === null) msg.reply('Please register using `~register` first!');
      
      User.findById(doc._id)
        .then((doc) => {
          let avg = doc.tests.reduce((total, num) => {return total + num}, 0) / doc.tests.length;
          let rank = 'Undetermined';
          if (avg < 50) {
            rank = "Novice"
          } else if (avg < 60) {
            rank = "Iron"
          } else if (avg < 70) {
            rank = "Bronze"
          } else if (avg < 80) {
            rank = "Silver"
          } else if (avg < 90) {
            rank = "Gold"
          } else if (avg < 100) {
            rank = "Diamond" 
          } else if (avg < 110) {
            rank = "Platinum"
          } else if (avg < 120) {
            rank = "Demon"
          } else if (avg >= 120) {
            rank = "God"
          }

          const embed = new EmbedBuilder()
            .setColor([255, 0, 255])
            .setTitle(`Typing statistics for ${msg.author.username}:`)
            .setDescription(`Tests taken: **${doc.tests.length}**\nAverage WPM: **${avg}**\nRank: **${rank}**`);
          
          msg.channel.send({embeds: [embed]});
        });
        


  }

  });

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
