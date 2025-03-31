import { Client, IntentsBitField, REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { commands } from "./command.js";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import ytdl from "@distube/ytdl-core";
dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});
const apiKey = process.env.YOUTUBE_API_KEY;
const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
            'X-Origin': 'https://www.youtube.com',
            "x-youtube-api-key": process.env.YOUTUBE_API_KEY,
        },
    },
});
player.extractors.register(YoutubeiExtractor, true);

const rest = new REST({ version: "10" }).setToken(process.env.LOGIN_TOKEN);

client.once("ready", async (c) => {
    console.log(`${c.user.username} is ready to hiphop!`);

    try {
        // Clear global commands
        console.log("Clearing global commands...");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log("Global commands cleared.");

        // Clear and re-register guild commands for all guilds
        client.guilds.cache.forEach(async (guild) => {
            console.log(`Clearing and updating commands for guild: ${guild.name} (${guild.id})`);

            // Clear guild-specific commands
            // await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), { body: [] });

            // Re-register guild-specific commands
            await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), { body: commands });

            console.log(`Successfully updated commands for guild: ${guild.name}`);
        });
    } catch (error) {
        console.error("Error clearing or updating commands:", error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const command = commands.find((cmd) => cmd.name === commandName);

    if (!command) {
        return await interaction.reply({ content: "Unknown command", ephemeral: true });
    }

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error("Error executing command:", error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});

const token = process.env.LOGIN_TOKEN;
client.login(token);


