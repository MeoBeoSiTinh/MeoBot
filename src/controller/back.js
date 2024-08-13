import { EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const back = async (client, interaction) => {
    const queue = useQueue(interaction.guild);
    if (!queue?.isPlaying()){
        return await interaction.reply(`No music currently playing `)
    }
    if (!queue.history.previousTrack) 
        return await interaction.reply("there is no previous song")
    await queue.history.back();
    const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Playing the previous track ✅` });
    await interaction.reply({embeds:[embed]})
}