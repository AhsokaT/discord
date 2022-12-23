"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RENAME_HOUSE = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('renamehouse')
    .setDescription('Rename a house')
    .addRoleOption(option => option
    .setName('house')
    .setDescription('The house to rename'))
    .addStringOption(option => option
    .setName('name')
    .setDescription('The new name of the house'));
exports.RENAME_HOUSE = new template_1.Command()
    .addIdentifiers('renamehouse')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
    interaction.reply('renamehouse');
});
