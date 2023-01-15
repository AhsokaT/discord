"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("./template");
const SLASH = new discord_js_1.SlashCommandBuilder()
    .setName('message')
    .setDescription('Send a message to a channel')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages)
    .addChannelOption(option => option
    .setName('channel')
    .setDescription('Channel to send message to')
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setRequired(true))
    .addStringOption(option => option
    .setName('message')
    .setDescription('Message to send')
    .setRequired(true));
exports.MESSAGE = new template_1.Command()
    .addGuilds('509135025560616963')
    .addBuilders(SLASH)
    .addIdentifiers('message')
    .onChatInputCommand(async (interaction) => {
    try {
        await interaction.deferReply({ ephemeral: true });
    }
    catch {
        return;
    }
    const channel = interaction.options.getChannel('channel', true);
    const content = interaction.options.getString('message', true);
    let message;
    try {
        message = await channel.send(content);
    }
    catch {
        return void interaction.editReply('Failed to send message :(');
    }
    interaction.editReply({
        content: `[Message](${message.url}) sent to ${channel}`,
        components: [
            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`MESSAGEDELETE_${message.channelId}_${message.id}`)
                .setLabel('Delete')
                .setStyle(discord_js_1.ButtonStyle.Danger))
        ]
    }).catch(console.warn);
});
