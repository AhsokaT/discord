"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCommand = void 0;
const discord_js_1 = require("discord.js");
const USER_CONTEXT_MENU = new discord_js_1.ContextMenuCommandBuilder()
    .setName('Ban')
    .setType(discord_js_1.ApplicationCommandType.User)
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers);
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addUserOption(new discord_js_1.SlashCommandUserOption()
    .setName('member')
    .setDescription('Member to be banned')
    .setRequired(true))
    .addStringOption(new discord_js_1.SlashCommandStringOption()
    .setName('reason')
    .setDescription('Reason for the ban')
    .setRequired(true)
    .addChoices({
    name: 'Suspicious or spam account',
    value: 'Suspicious or spam account'
}, {
    name: 'Compromised or hacked account',
    value: 'Compromised or hacked account'
}, {
    name: 'Breaking server rules',
    value: 'Breaking server rules'
}, {
    name: 'Other',
    value: 'OTHER'
}))
    .addIntegerOption(new discord_js_1.SlashCommandIntegerOption()
    .setName('history')
    .setDescription('Delete message history')
    .addChoices({
    name: 'Don\'t delete any',
    value: 0
}, {
    name: 'Previous hour',
    value: 3600
}, {
    name: 'Previous 6 hours',
    value: 21600
}, {
    name: 'Previous 12 hours',
    value: 43200
}));
class BanCommand {
    get names() {
        return ['Ban', 'BAN', 'ban'];
    }
    get guilds() {
        return ['509135025560616963'];
    }
    get commandBuilders() {
        return [SLASH_COMMAND, USER_CONTEXT_MENU];
    }
    // receive(interaction: UserContextMenuCommandInteraction<'cached'>): void;
    // receive(interaction: ChatInputCommandInteraction<'cached'>): void;
    // receive(interaction: ModalSubmitInteraction<'cached'>): void;
    receive(interaction) {
        if (!interaction.member.permissions.has(discord_js_1.PermissionFlagsBits.BanMembers) && interaction.isRepliable())
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
    buildReasonModal(member) {
        return new discord_js_1.ModalBuilder()
            .setTitle('Ban')
            .setCustomId(`BAN_${member.id}`)
            .addComponents(new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.TextInputBuilder()
            .setCustomId('REASON')
            .setPlaceholder(`Reason for banning ${member.user.tag}`)
            .setLabel('Reason')
            .setMaxLength(512)
            .setStyle(discord_js_1.TextInputStyle.Paragraph)
            .setRequired(false)));
    }
    async receiveModalSubmit(interaction) {
        const targetID = interaction.customId.split('_').pop();
        if (!targetID)
            return console.error(`Target ID not included in custom ID`);
        let target;
        try {
            target = await interaction.guild.members.fetch(targetID);
        }
        catch (err) {
            return void interaction.reply({ content: `:x: I was unable to fetch member with ID ${targetID}`, ephemeral: true });
        }
        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
        const reason = interaction.fields.getTextInputValue('REASON') ?? '';
        this.ban(target, reason, interaction);
    }
    async receiveButton(interaction) {
        const targetID = interaction.customId.split('_').pop();
        if (!targetID)
            return console.error(`Target ID not included in custom ID`);
        let target;
        try {
            target = await interaction.guild.members.fetch(targetID);
        }
        catch (err) {
            return void interaction.reply({ content: `User with ID **${targetID}** is not in this server`, ephemeral: true });
        }
        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
        interaction.showModal(this.buildReasonModal(target))
            .catch(console.error);
    }
    async receiveUserContextMenu(interaction) {
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
    receiveChatInput(interaction) {
        if (!interaction.member.permissions.has(discord_js_1.PermissionFlagsBits.BanMembers))
            return void interaction.reply({ content: ':x: You require the permission `ban members` to perform this action', ephemeral: true }).catch(console.debug);
        const target = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason', true);
        if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
        if (!target.bannable)
            return void interaction.reply({ content: `❌ I am unable to ban **${target.user.tag}** due to role hierarchy`, ephemeral: true });
        if (reason === 'OTHER')
            return void interaction.showModal(this.buildReasonModal(target)).catch(console.debug);
        this.ban(target, reason, interaction);
    }
    static buildRevokeBanButton(banned) {
        return new discord_js_1.ButtonBuilder()
            .setCustomId(`UNBAN_${banned.id}`)
            .setLabel('Revoke ban')
            .setStyle(discord_js_1.ButtonStyle.Primary);
    }
    buildBanEmbed(banned, moderator) {
        return new discord_js_1.EmbedBuilder()
            .setColor('#2F3136')
            .setFooter({ text: `Banned user ID ${banned.user.id}\nModerator ID ${moderator.id}` })
            .setDescription(`**${banned.user.tag}** was **snapped** out of existence by ${moderator}`)
            .setImage('https://media.giphy.com/media/LOoaJ2lbqmduxOaZpS/giphy.gif?cid=ecf05e47gzp0mc04nqhf3ejthzmnd7vv3db10bzdq941ucfm&rid=giphy.gif&ct=g');
    }
    async ban(member, reason, interaction) {
        if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
            return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
        member.ban({ reason })
            .then(async (banned) => {
            let actions = new discord_js_1.ActionRowBuilder()
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
            actions.addComponents(new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(auditMessage.url)
                .setLabel('Audit'));
            reply.edit({ components: [actions] });
        })
            .catch(() => interaction.reply({ content: `❌ I was unable to ban **${member.user.tag}** for an unknown reason`, ephemeral: true }).catch(console.debug));
    }
    async audit(banned, moderator, reason) {
        let auditChannel = await moderator.guild.channels.fetch('1025143957186941038')
            .catch(console.debug);
        if (!auditChannel || !auditChannel.isTextBased())
            return;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('Member ban')
            .setAuthor({ name: moderator.user.tag })
            .setColor('#2F3136')
            .addFields({ name: 'Moderator', value: moderator.toString(), inline: true }, { name: 'Banned user', value: banned.user.tag, inline: true }, { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true })
            .setFooter({ text: `Banned user ID ${banned.id}\nModerator ID ${moderator.id}` });
        if (reason)
            embed.addFields({ name: 'Reason', value: reason });
        return auditChannel.send({
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(BanCommand.buildRevokeBanButton(banned))
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId(`USERINFO_${moderator.id}`)
                    .setLabel('Moderator')
                    .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                    .setCustomId(`USERINFO_${banned.id}`)
                    .setLabel('Banned user')
                    .setStyle(discord_js_1.ButtonStyle.Secondary))
            ],
            embeds: [embed],
            allowedMentions: { parse: [] }
        });
    }
}
exports.BanCommand = BanCommand;
