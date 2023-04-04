"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_POINTS = void 0;
const discord_js_1 = require("discord.js");
const housePoints_1 = require("../../housePoints");
const template_1 = require("../template");
const housePicker_1 = require("./housePicker");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('housepoints')
    .setDescription('Add or remove points from any house')
    .addIntegerOption(option => option
    .setName('tigers')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('owls')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('ravens')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('pandas')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('turtles')
    .setDescription('New total'));
exports.HOUSE_POINTS = new template_1.Command()
    .addIdentifiers('housepoints')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const client = interaction.client;
    const manager = client.housePointManager;
    const current = new housePoints_1.HousePoints(manager.cache);
    const newTotals = Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc[h], interaction.options.getInteger(h.toUpperCase().replace('s', '')) ?? current[h]), new housePoints_1.HousePoints());
    const changes = current.difference(newTotals);
});
