"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_POINTS_COMMAND = exports.ASSIGN_POINTS_COMMAND = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const house_1 = require("./house");
function houseOption(name) {
    return { name: house_1.House[name], value: name };
}
const ASSIGN_POINTS = new discord_js_1.SlashCommandBuilder()
    .setName('assignpoints')
    .setDescription('WIP')
    .addStringOption(builder => builder
    .setName('house')
    .setDescription('House to assign points to')
    .addChoices(...Object.keys(house_1.House).map(houseOption))
    .setRequired(true))
    .addIntegerOption(builder => builder
    .setName('points')
    .setDescription('The number of points to assign')
    .setRequired(true));
const REMOVE_POINTS = new discord_js_1.SlashCommandBuilder()
    .setName('removepoints')
    .setDescription('WIP')
    .addStringOption(builder => builder
    .setName('house')
    .setDescription('House to assign points to')
    .addChoices(...Object.keys(house_1.House).map(houseOption))
    .setRequired(true))
    .addIntegerOption(builder => builder
    .setName('points')
    .setDescription('The number of points to assign')
    .setRequired(true));
exports.ASSIGN_POINTS_COMMAND = new template_1.Command()
    .addIdentifiers('assignpoints')
    .addGuilds(process.env.DAILY_OFFENDERS)
    .addBuilders(ASSIGN_POINTS)
    .onChatInputCommand(interaction => {
    const house = interaction.options.getString('house', true);
    const points = interaction.options.getInteger('points', true);
    interaction.client.housePointManager.assignPoints(house, points);
    interaction.reply({ content: `:partying_face: Assigned **${points} points** to **${house_1.House[house]}**`, ephemeral: true }).catch(console.debug);
});
exports.REMOVE_POINTS_COMMAND = new template_1.Command()
    .addIdentifiers('removepoints')
    .addGuilds(process.env.DAILY_OFFENDERS)
    .addBuilders(REMOVE_POINTS)
    .onChatInputCommand(interaction => {
    const house = interaction.options.getString('house', true);
    const points = interaction.options.getInteger('points', true);
    interaction.client.housePointManager.removePoints(house, points);
    interaction.reply({ content: `:confused: Deducted **${points} points** from **${house_1.House[house]}**`, ephemeral: true }).catch(console.debug);
});
