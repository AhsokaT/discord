import { GuildTextBasedChannel } from "discord.js";
import { Command } from "./template";

export const MESSAGE_DELETE = new Command()
    .addIdentifiers('MESSAGEDELETE')
    .onButton(async interaction => {
        const [_, channelID, messageID] = interaction.customId.split('_');

        interaction.guild.channels.fetch(channelID)
            .then(channel => (channel as GuildTextBasedChannel).messages.fetch(messageID))
            .then(message => message.delete())
            .then(() => interaction.update({ content: 'Message deleted', components: [] }))
            .catch(() => interaction.update('Failed to delete message :('));
    });