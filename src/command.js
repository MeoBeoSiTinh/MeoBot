import { play, queue } from "./controller/index.js";

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
    {
        name: 'queue',
        description: 'Get current queue',
        execute: async(client, interaction) => {
            queue(client, interaction);
        }
    },
];

