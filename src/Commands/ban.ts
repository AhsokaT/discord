import { ActionRowBuilder, ApplicationCommandDataResolvable, ApplicationCommandType, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder, GuildMember, GuildTextBasedChannel, Interaction, MembershipScreeningFieldType, MessageActionRowComponentBuilder, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, PermissionFlagsBits, SelectMenuBuilder, SelectMenuOptionBuilder, SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption, Snowflake, TextInputBuilder, TextInputStyle, User, UserContextMenuCommandInteraction } from 'discord.js';
import { Command } from '../client';

const USER_CONTEXT_MENU = new ContextMenuCommandBuilder()
    .setName('Ban')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(
        new SlashCommandUserOption()
            .setName('member')
            .setDescription('Member to be banned')
            .setRequired(true)
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName('reason')
            .setDescription('Reason for the ban')
            .setRequired(true)
            .addChoices(
                {
                    name: 'Suspicious or spam account',
                    value: 'Suspicious or spam account'
                },
                {
                    name: 'Compromised or hacked account',
                    value: 'Compromised or hacked account'
                },
                {
                    name: 'Breaking server rules',
                    value: 'Breaking server rules'
                },
                {
                    name: 'Other',
                    value: 'OTHER'
                }
            )
    )
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName('history')
            .setDescription('Delete message history')
            .addChoices(
                {
                    name: 'Don\'t delete any',
                    value: 0
                },
                {
                    name: 'Previous hour',
                    value: 3600
                },
                {
                    name: 'Previous 6 hours',
                    value: 21600
                },
                {
                    name: 'Previous 12 hours',
                    value: 43200
                }
            )
    );

export class BanCommand implements Command {
    get names(): string[] {
        return ['Ban', 'BAN', 'ban'];
    }

    get guilds(): Snowflake[] {
        return ['509135025560616963'];
    }

    get commandBuilders(): ApplicationCommandDataResolvable[] {
        return [SLASH_COMMAND, USER_CONTEXT_MENU];
    }

    // receive(interaction: UserContextMenuCommandInteraction<'cached'>): void;
    // receive(interaction: ChatInputCommandInteraction<'cached'>): void;
    // receive(interaction: ModalSubmitInteraction<'cached'>): void;
    receive(interaction: Interaction<'cached'>): void {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers) && interaction.isRepliable())
            return void interaction.reply({ content: ':x: You require the permission `ban members` to perform this action', ephemeral: true }).catch(console.debug);

        if (interaction.isUserContextMenuCommand())
            return void this.receiveUserContextMenu(interaction);

        if (interaction.isChatInputCommand())
            return this.receiveChatInput(interaction);

        if (interaction.isModalSubmit())
            return void this.receiveModalSubmit(interaction);

        if (interaction.isButton())
            return void this.receiveButton(interaction);
    }

    private buildReasonModal(member: GuildMember): ModalBuilder {
        return new ModalBuilder()
            .setTitle('Ban')
            .setCustomId(`BAN_${member.id}`)
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('REASON')
                            .setPlaceholder(`Reason for banning ${member.user.tag}`)
                            .setLabel('Reason')
                            .setMaxLength(512)
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                    )
            );
    }

    private async receiveModalSubmit(interaction: ModalSubmitInteraction<'cached'>): Promise<void> {
        const targetID = interaction.customId.split('_').pop();

        if (!targetID)
            return console.error(`Target ID not included in custom ID`);

        let target: GuildMember;

        try {
            target = await interaction.guild.members.fetch(targetID);
        } catch (err) {
            return void interaction.reply({ content: `:x: I was unable to fetch member with ID ${targetID}`, ephemeral: true });
        }

        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });

        const reason = interaction.fields.getTextInputValue('REASON') ?? '';

        this.ban(target, reason, interaction);
    }

    private async receiveButton(interaction: ButtonInteraction<'cached'>) {
        const targetID = interaction.customId.split('_').pop();

        if (!targetID)
            return console.error(`Target ID not included in custom ID`);

        let target: GuildMember;

        try {
            target = await interaction.guild.members.fetch(targetID);
        } catch (err) {
            return void interaction.reply({ content: `User with ID **${targetID}** is not in this server`, ephemeral: true });
        }

        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });

        interaction.showModal(this.buildReasonModal(target))
            .catch(console.error);
    }

    private async receiveUserContextMenu(interaction: UserContextMenuCommandInteraction<'cached'>) {
        const target = interaction.targetMember;

        if (!target)
            return void interaction.reply({ content: 'This user is not a member of this server', ephemeral: true }).catch(console.debug);

        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });

        if (!target.bannable)
            return void interaction.reply({ content: `:x: I am unable to ban **${target.user.tag}** due to role hierarchy`, ephemeral: true });

        interaction.showModal(this.buildReasonModal(target))
            .catch(console.error);
    }

    private receiveChatInput(interaction: ChatInputCommandInteraction<'cached'>): void {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
            return void interaction.reply({ content: ':x: You require the permission `ban members` to perform this action', ephemeral: true }).catch(console.debug);

        const target = interaction.options.getMember('member')!;
        const reason = interaction.options.getString('reason', true);

        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });

        if (!target.bannable)
            return void interaction.reply({ content: `❌ I am unable to ban **${target.user.tag}** due to role hierarchy`, ephemeral: true });

        if (reason === 'OTHER')
            return void interaction.showModal(this.buildReasonModal(target)).catch(console.debug);

        this.ban(target, reason, interaction);
    }

    static buildRevokeBanButton(banned: GuildMember) {
        return new ButtonBuilder()
            .setCustomId(`UNBAN_${banned.id}`)
            .setLabel('Revoke ban')
            .setStyle(ButtonStyle.Primary);
    }

    private buildBanEmbed(banned: GuildMember, moderator: User) {
        return new EmbedBuilder()
            .setColor('#2F3136')
            .setFooter({ text: `Banned user ID ${banned.user.id}\nModerator ID ${moderator.id}` })
            .setDescription(`**${banned.user.tag}** was **snapped** out of existence by ${moderator}`)
            .setImage('https://media.giphy.com/media/LOoaJ2lbqmduxOaZpS/giphy.gif?cid=ecf05e47gzp0mc04nqhf3ejthzmnd7vv3db10bzdq941ucfm&rid=giphy.gif&ct=g');
    }

    private async ban(member: GuildMember, reason: string, interaction: ModalSubmitInteraction<'cached'> | ChatInputCommandInteraction<'cached'>) {
        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });

        member.ban({ reason })
            .then(async banned => {
                let actions = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(BanCommand.buildRevokeBanButton(banned));

                const reply = await interaction.reply({
                    components: [actions],
                    embeds: [this.buildBanEmbed(banned, interaction.user)],
                    allowedMentions: { parse: [] },
                    fetchReply: true
                });

                let auditMessage = await this.audit(banned, interaction.member, reason)
                    .catch(console.debug);

                if (!auditMessage)
                    return;

                actions.addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(auditMessage.url)
                        .setLabel('Audit')
                );

                reply.edit({ components: [actions] });
            })
            .catch(() => interaction.reply({ content: `❌ I was unable to ban **${member.user.tag}** for an unknown reason`, ephemeral: true }).catch(console.debug));
    }

    private async audit(banned: GuildMember, moderator: GuildMember, reason: string) {
        let auditChannel = await moderator.guild.channels.fetch('1025143957186941038')
            .catch(console.debug);

        if (!auditChannel || !auditChannel.isTextBased())
            return;

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

        return auditChannel.send({
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(BanCommand.buildRevokeBanButton(banned))
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
        });
    }
}