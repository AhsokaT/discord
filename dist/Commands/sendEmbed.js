"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEND_EMBED = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("./template");
exports.SEND_EMBED = new template_1.Command()
    .addGuilds('509135025560616963')
    .addIdentifiers('embed')
    .addBuilders(new discord_js_1.SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send an embed')
    .addChannelOption(option => option
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setName('channel')
    .setDescription('Channel to send the embed in')
    .setRequired(true))
    .addStringOption(option => option
    .setName('title')
    .setDescription('Title of the embed')
    .setRequired(false))
    .addStringOption(option => option
    .setName('description')
    .setDescription('Description of the embed')
    .setRequired(false))
    .addStringOption(option => option
    .setName('color')
    .setDescription('Color of the embed')
    .addChoices(...Object.keys(discord_js_1.Colors).slice(0, 25).map(colour => ({ name: colour, value: colour })))
    .setRequired(false)))
    .onChatInputCommand(async (i) => {
    try {
        await i.deferReply({ ephemeral: true });
    }
    catch {
        return;
    }
    const channel = i.options.getChannel('channel', true);
    const colour = i.options.getString('color', false);
    const description = i.options.getString('description', false);
    const title = i.options.getString('title', false);
    const embed = new discord_js_1.EmbedBuilder();
    if (colour)
        embed.setColor(discord_js_1.Colors[colour]);
    if (description)
        embed.setDescription(description);
    if (title)
        embed.setTitle(title);
    channel.send({ embeds: [embed] })
        .then(m => {
        setTimeout(() => m.delete(), 15000);
        return m;
    })
        .then(m => i.editReply(`[Message](${m.url}) sent in ${m.channel}`))
        .catch(() => i.editReply('Failed to send message'));
});
