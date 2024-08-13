import { play } from "./controller/play.js";

export const commands = [
    {
        name: 'play',
        description: 'Plays a song from YouTube',
        options: [
            {
                name: 'query',
                type: 3, // STRING
                description: 'The YouTube URL or the title of the song',
                required: true,
            },
        ],
        execute: async(client, interaction) => {
            play(client, interaction);
        }
    },

];

