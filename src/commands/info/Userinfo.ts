import { Command } from '@sapphire/framework';
import {
    EmbedBuilder,
    GuildMember,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import { PieceOptions, resolveGuildMemberData } from '../../util/util.js';

@PieceOptions({
    name: 'Info',
})
export class UserInfo extends Command {
    contextMenuRun(interaction: UserContextMenuCommandInteraction) {
        const user = interaction.targetUser;
        const member = interaction.targetMember;

        const infoEmbed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 4096 }))
            .addFields({ name: 'Username', value: user.tag });

        const nickname =
            member && member instanceof GuildMember
                ? member.nickname
                : member?.nick;
        const displayName = nickname ?? user.globalName;

        if (displayName)
            infoEmbed.addFields({ name: 'Display name', value: displayName });

        infoEmbed.addFields({ name: 'Snowflake ID', value: user.id });

        if (member) {
            const data = resolveGuildMemberData(member);

            if (data.roles.length > 1) {
                const roles = data.roles
                    .filter(
                        (role) =>
                            (typeof role === 'string' ? role : role.id) !==
                            interaction.guildId
                    )
                    .map((role) =>
                        typeof role === 'string' ? `<@&${role}>` : String(role)
                    )
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

        interaction
            .reply({
                ephemeral: true,
                allowedMentions: { parse: [] },
                embeds: [infoEmbed],
            })
            .catch(console.warn);
    }
}
