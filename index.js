require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new YtDlpPlugin()]
});

client.on('ready', () => {
  console.log(`🎶 ROne_Music connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.split(' ');
  const command = args.shift().toLowerCase();

  if (command === '!play') {
    if (!message.member.voice.channel) {
      return message.reply('❌ Tu dois être dans un salon vocal pour jouer de la musique.');
    }
    const query = args.join(' ');
    try {
      distube.play(message.member.voice.channel, query, {
        textChannel: message.channel,
        member: message.member,
      });
    } catch (error) {
      console.error('💥 Erreur pendant la lecture :', error);
      message.channel.send('❌ Impossible de lire cette musique.');
    }
  }

  if (command === '!skip') {
    distube.skip(message);
  }

  if (command === '!stop') {
    distube.stop(message);
  }
});

client.login(process.env.DISCORD_TOKEN);
