import { EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const clear = async (client, interaction) => {
    const queue = useQueue(interaction.guild);
    if (!queue?.isPlaying()){
        return await interaction.reply(`No music currently playing `)
    }
    if (!queue.tracks.toArray()[1]) 
        return await interaction.reply({ content: `No music in the queue after the current one ${interaction.member}... try again ? ❌` });
    queue.tracks.clear();
    const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Track ko còn và Lan Anh cũng vậy` });
    await interaction.reply({embeds:[embed]})
}