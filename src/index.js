import { Client, IntentsBitField, REST, Routes, } from "discord.js";
import * as dotenv from 'dotenv';
import { commands } from "./command.js";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { play } from "./controller/play.js";

dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates
    ]
})

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
player.extractors.register(YoutubeiExtractor,{})


client.once('ready',(c) => {
    console.log(`${c.user.displayName} ready to hiphop`);
    client.guilds.cache.forEach(async guild => {
        console.log(`Connected to guild: ${guild.name} (ID: ${guild.id})`);
        const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`Registering slash commands for guild: ${guild.name} (${guild.id})`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
            { body: commands },
        );

        console.log(`Successfully registered slash commands for guild: ${guild.name}`);
    } catch (error) {
        console.error(`Failed to register commands for guild: ${guild.name}`, error);
    }
    });
})



client.on('guildCreate', async guild => {
    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`Registering slash commands for guild: ${guild.name} (${guild.id})`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
            { body: commands },
        );

        console.log(`Successfully registered slash commands for guild: ${guild.name}`);
    } catch (error) {
        console.error(`Failed to register commands for guild: ${guild.name}`, error);
    }
});







client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    const command = commands.find(cmd => cmd.name === commandName);
  
    if (!command) {
      return await interaction.reply({ content: 'Unknown command', ephemeral: true });
    }
  
    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error('Error executing command:', error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

})



const token = process.env.LOGIN_TOKEN
client.login(token)


