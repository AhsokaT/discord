"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BanCommand = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const builders_1 = require("./builders");
const audit_1 = require("./audit");
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
exports.BanCommand = new template_1.Command()
    .addIdentifiers('Ban', 'ban', 'BAN')
    .addBuilders(SLASH_COMMAND, USER_CONTEXT_MENU)
    .onUserContextMenuCommand(interaction => {
    const target = interaction.targetMember;
    if (!target)
        return void interaction.reply({ content: 'This user is not a member of this server', ephemeral: true }).catch(console.debug);
    if (interaction.member.user.id === target.user.id)
        return void interaction.reply({ content: `:x: You cannot ban yourself`, ephemeral: true });
    if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
        return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
    if (!target.bannable)
        return void interaction.reply({ content: `:x: I am unable to ban **${target.user.tag}** due to role hierarchy`, ephemeral: true });
    interaction.showModal((0, builders_1.buildReasonModal)(target))
        .catch(console.debug);
})
    .onModalSubmit(async (interaction) => {
    const targetID = interaction.customId.split('_').pop();
    if (!targetID) {
        console.debug(`Target ID not included in custom ID`);
        return void interaction.deferUpdate();
    }
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
    // ban
})
    .onButton(async (interaction) => {
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
    if (interaction.member.user.id === target.user.id)
        return void interaction.reply({ content: `:x: You cannot ban yourself`, ephemeral: true });
    if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
        return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
    interaction.showModal((0, builders_1.buildReasonModal)(target))
        .catch(console.debug);
})
    .onChatInputCommand(interaction => {
    if (!interaction.member.permissions.has(discord_js_1.PermissionFlagsBits.BanMembers))
        return void interaction.reply({ content: ':x: You require the permission `ban members` to perform this action', ephemeral: true }).catch(console.debug);
    const target = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason', true);
    if (interaction.member.user.id === target.user.id)
        return void interaction.reply({ content: `:x: You cannot ban yourself`, ephemeral: true });
    if (interaction.member.roles.highest.comparePositionTo(target.roles.highest) <= 0)
        return void interaction.reply({ content: `:x: You cannot ban members with an equal or higher role`, ephemeral: true });
    if (!target.bannable)
        return void interaction.reply({ content: `❌ I am unable to ban **${target.user.tag}** due to role hierarchy`, ephemeral: true });
    if (reason === 'OTHER')
        return void interaction.showModal((0, builders_1.buildReasonModal)(target)).catch(console.debug);
    target.ban({ reason })
        .then(banned => (0, audit_1.audit)(banned, interaction.member, reason).catch(console.debug))
        .catch(() => interaction.reply({ ephemeral: true, content: 'I was unable to ban...' }).catch(console.debug)); // err message
});
