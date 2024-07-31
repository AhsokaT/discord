import { Command } from '@sapphire/framework';
import {
    APIGuildMember,
    EmbedBuilder,
    GuildMember,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import { PieceOptions } from '../../util/util.js';

@PieceOptions({
    name: 'Info',
})
export class UserInfo extends Command {
    async contextMenuRun(interaction: UserContextMenuCommandInteraction) {
        const user = interaction.targetUser;
        const member = interaction.targetMember;
        const infoEmbed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 4096 }))
            .addFields({ name: 'Username', value: user.tag });
        const nickname = member && this.resolveGuildMemberData(member).nickname;
        const displayName = nickname ?? user.globalName;

        if (displayName)
            infoEmbed.addFields({ name: 'Display name', value: displayName });

        infoEmbed.addFields({ name: 'Snowflake ID', value: user.id });

        if (member) {
            const data = this.resolveGuildMemberData(member);

            if (data.roles.length > 1) {
                const roles = data.roles
                    .map((role) => (typeof role === 'string' ? role : role.id))
                    .filter((role) => role !== interaction.guildId)
                    .map((role) => `<@&${role}>`)
                    .join(' ');

                if (roles.length <= 1024)
                    infoEmbed.addFields({ name: 'Roles', value: roles });
            }

            if (data.premiumSince)
                infoEmbed.addFields({
                    name: 'Boosting since',
                    value: `<t:${Math.round(
                        data.premiumSince / 1000
                    )}:D> <t:${Math.round(data.premiumSince / 1000)}:R>`,
                });

            if (data.communicationDisabledUntil)
                infoEmbed.addFields({
                    name: 'Communication disabled until',
                    value: `<t:${Math.round(
                        data.communicationDisabledUntil / 1000
                    )}:f> <t:${Math.round(
                        data.communicationDisabledUntil / 1000
                    )}:R> :stopwatch:`,
                });

            if (data.joinedServer)
                infoEmbed.addFields({
                    name: 'Joined server',
                    value: `<t:${Math.round(
                        data.joinedServer / 1000
                    )}:D> <t:${Math.round(data.joinedServer / 1000)}:R>`,
                });
        }

        infoEmbed.addFields({
            name: 'Joined Discord',
            value: `<t:${Math.round(
                user.createdTimestamp / 1000
            )}:D> <t:${Math.round(user.createdTimestamp / 1000)}:R>`,
        });

        await interaction.reply({
            ephemeral: true,
            allowedMentions: { parse: [] },
            embeds: [infoEmbed],
        });
    }

    resolveGuildMemberData(member: GuildMember | APIGuildMember) {
        if (member instanceof GuildMember)
            return {
                nickname: member.nickname,
                roles: [
                    ...member.roles.cache
                        .sort((a, b) => b.position - a.position)
                        .values(),
                ],
                premiumSince: member.premiumSinceTimestamp,
                communicationDisabledUntil:
                    member.communicationDisabledUntilTimestamp,
                joinedServer: member.joinedTimestamp,
            };

        return {
            nickname: member.nick ?? null,
            roles: member.roles,
            premiumSince: member.premium_since
                ? Date.parse(member.premium_since)
                : null,
            communicationDisabledUntil: member.communication_disabled_until
                ? Date.parse(member.communication_disabled_until)
                : null,
            joinedServer: member.joined_at
                ? Date.parse(member.joined_at)
                : null,
        };
    }
}
