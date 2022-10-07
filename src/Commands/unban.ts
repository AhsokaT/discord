import { ActionRowBuilder, ApplicationCommandDataResolvable, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, GuildMember, Interaction, MessageActionRowComponentBuilder, PermissionFlagsBits, Snowflake, User } from 'discord.js';
import { Command } from '../client';

export class UnbanCommand implements Command {
    get names(): string[] {
        return ['UNBAN'];
    }

    get commandBuilders(): ApplicationCommandDataResolvable[] {
        return [];
    }

    get guilds(): Snowflake[] {
        return [];
    }

    receive(interaction: ButtonInteraction<'cached'>): void;
    receive(interaction: Interaction<'cached'>) {
        if (interaction.isButton())
            return void this.receiveButton(interaction);
    }

    private async receiveButton(interaction: ButtonInteraction<'cached'>) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
            return void interaction.reply({ content: ':x: You require the permission `ban members` to perform this action', ephemeral: true }).catch(console.debug);

        const targetID = interaction.customId.split('_').pop();

        if (!targetID)
            return console.error(`Target ID not included in custom ID`);

        interaction.guild.members.unban(targetID)
            .then(async unbanned => {
                let user = unbanned ? unbanned : await interaction.client.users.fetch(targetID).catch(console.debug);

                interaction.reply({ content: `Revoked ban for **${user ? user.tag : targetID}**`, ephemeral: true, allowedMentions: { parse: [] } }).catch(console.debug);

                if (user)
                    this.audit(user, interaction.member).catch(console.debug);
            })
            .catch(() => interaction.reply({ content: `User with ID **${targetID}** is not banned from this server`, ephemeral: true }).catch(console.debug));
    }

    private async audit(unbanned: User, moderator: GuildMember) {
        let auditChannel = await moderator.guild.channels.fetch(process.env.AUDIT_CHANNEL!)
            .catch(console.debug);

        if (!auditChannel || !auditChannel.isTextBased())
            return;

        const embed = new EmbedBuilder()
            .setTitle('Ban revoke')
            .setAuthor({ name: moderator.user.tag })
            .setColor('#2F3136')
            .addFields(
                { name: 'Moderator', value: moderator.toString(), inline: true },
                { name: 'Unbanned user', value: unbanned.tag, inline: true },
                { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: `Unbanned user ID ${unbanned.id}\nModerator ID ${moderator.id}` });

        return auditChannel.send({
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        // new ButtonBuilder()
                        //     .setCustomId(`BAN_${unbanned.id}`)
                        //     .setLabel('Reinstate ban')
                        //     .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId(`USERINFO_${moderator.id}`)
                            .setLabel('Moderator')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId(`USERINFO_${unbanned.id}`)
                            .setLabel('Unbanned user')
                            .setStyle(ButtonStyle.Secondary)
                    )
            ],
            embeds: [embed],
            allowedMentions: { parse: [] }
        });
    }
}