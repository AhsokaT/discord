import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, Message, MessageActionRowComponentBuilder } from 'discord.js';
import { buildBanRevokeButton } from './builders';

export function audit(banned: GuildMember, moderator: GuildMember, reason: string): Promise<Message<true>> {
    return new Promise(async (res, rej) => {
        let auditChannel = await moderator.guild.channels.fetch(process.env.AUDIT_CHANNEL!)
            .catch(console.debug);

        if (!auditChannel || !auditChannel.isTextBased())
            return rej('Audit channel could not be fetched');

        const embed = new EmbedBuilder()
            .setTitle('Member ban')
            .setAuthor({ name: moderator.user.tag })
            .setColor('#2F3136')
            .addFields(
                { name: 'Moderator', value: moderator.toString(), inline: true },
                { name: 'Banned user', value: banned.user.tag, inline: true },
                { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: `Banned user ID ${banned.id}\nModerator ID ${moderator.id}` });

        if (reason)
            embed.addFields({ name: 'Reason', value: reason });

        auditChannel.send({
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(buildBanRevokeButton(banned))
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`USERINFO_${moderator.id}`)
                            .setLabel('Moderator')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`USERINFO_${banned.id}`)
                            .setLabel('Banned user')
                            .setStyle(ButtonStyle.Secondary)
                    )
            ],
            embeds: [embed],
            allowedMentions: { parse: [] }
        }).then(res).catch(rej);
    });
}