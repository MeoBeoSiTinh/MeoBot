import { QueryType, useMainPlayer } from "discord-player";
import { EmbedBuilder } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

export const play = async (client, interaction) => {
  if (!interaction.member.voice.channel) {
    return interaction.reply(
      "You need to be in a Voice Channel to play a song."
    );
  }

  const player = useMainPlayer();
  let query = interaction.options.getString("query");
  let defaultEmbed = new EmbedBuilder().setColor("#2f3136");

  // Search for the song
  const result = await player.search(query, {
    requestedBy: interaction.member,
    searchEngine: QueryType.AUTO,
  });

  // If no tracks were found
  if (!result?.tracks.length) {
    await interaction.reply("No Results :3");
  }
  try {
    const  song  = await player.play(interaction.member.voice.channel, query, {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
        },
        volume: process.env.VOLUMN,
        leaveOnEmpty: process.env.LEAVE_ON_EMPTY,
        leaveOnEmptyCooldown: process.env.LEAVE_ON_EMPTY_COOLDOWN,
        leaveOnEnd: process.env.LEAVE_ON_END,
        leaveOnEndCooldown: process.env.LEAVE_ON_END_COOLDOWN,
      },
    });
    
    defaultEmbed
      .setDescription(
        `[${song.track.title}](${song.track.url}) has been added to the Queue`
      )
      .setThumbnail(song.track.thumbnail)
      .setFooter({ text: `Duration: ${song.track.duration}` });
    await interaction.reply({ embeds: [defaultEmbed] });
  } catch (error) {
    console.log(`Play error: ${error}`);
    await interaction.reply(`I can't join the voice channel... try again ? <❌>`);
  }
};
