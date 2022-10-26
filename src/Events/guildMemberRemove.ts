import { ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { UserInfoButton } from '../Commands/builders';
import { sendToLogChannel } from '../misc';
import { ClientEvent } from './ClientEvent';

export const guildMemberRemove = new ClientEvent('guildMemberRemove', member => {
    const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Member left')
        .setAuthor({ name: member.user.tag })
        .addFields(
            { name: 'Member', value: member.toString(), inline: true },
            { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
        );

    if (member.joinedTimestamp)
        embed.addFields({ name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:R>`, inline: true });

    sendToLogChannel(member.client, {
        embeds: [embed],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UserInfoButton(member.user.id))
        ],
        allowedMentions: { parse: [] }
    })
    .then(message => setTimeout(() => message.delete(), 15_000))
    .catch(console.debug);
});