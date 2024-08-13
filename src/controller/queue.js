import { useQueue } from "discord-player";
import { EmbedBuilder } from "discord.js";

export const queue = async (client, interaction) => {
  const queue = useQueue(interaction.guild);
  console.log(queue);
  
  if (!queue) await interaction.reply("Đm queue trống mà.");
  if (!queue.tracks.toArray()[0])
    await interaction.reply("Hết òi!! Order thêm đi.");
else{

  const methods = ["", "🔁", "🔂"];
  const songs = queue.tracks.size;
  const nextSongs =
    songs > 5
      ? `And ${songs - 5} other song(s)...`
      : `In the playlist ${songs} song(s)...`;
  const tracks = queue.tracks.map(
    (track, i) =>
      `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${
        track.requestedBy ? track.requestedBy.displayName : "unknown"
      })`
  );
  const embed = new EmbedBuilder()
    .setColor("#2f3136")
    .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
    .setAuthor({
      name:`Server queue - ${interaction.guild.name}${methods[queue.repeatMode]}`,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setDescription(
        `Current ${queue.currentTrack.title} \n\n ${tracks
          .slice(0, 5)
          .join("\n")} \n\n ${nextSongs}`
    )
    .setTimestamp()
    .setFooter({
      text:"Ai cũng legit cho đến khi họ skem ❤️",
      iconURL: interaction.member.avatarURL({ dynamic: true }),
    });
    await interaction.reply({embeds: [embed]})
}
};
