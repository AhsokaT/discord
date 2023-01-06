import { ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { Client } from '../client';
import { UserInfoButton } from '../Commands/builders';
import { ClientEvent } from './ClientEvent';

export const guildMemberRemove = new ClientEvent('guildMemberRemove', async member => {
    const ban = await member.guild.bans.fetch(member).catch(() => null);

    if (ban)
        return;

    const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Member left')
        .setAuthor({ name: member.user.tag })
        .addFields(
            { name: 'Member', value: member.toString(), inline: true },
            { name: 'Left', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
        );

    if (member.joinedTimestamp)
        embed.addFields({ name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:R>`, inline: true });

    (member.client as Client).sendToLogChannel({
        embeds: [embed],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UserInfoButton(member.user.id))
        ],
        allowedMentions: { parse: [] }
    })
    .catch(console.debug);
});