import { EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const skip = async (client, interaction) => {
    const queue = useQueue(interaction.guild);
    if (!queue?.isPlaying()){
        return await interaction.reply(`No music currently playing `)
    }
    const success = queue.node.skip();
    const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: success ? `Current music ${queue.currentTrack.title} skipped ✅` : `Something went wrong ${inter.member}... try again ? ❌` });
    await interaction.reply({embeds:[embed]})
}