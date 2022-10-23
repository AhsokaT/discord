"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEADERBOARD = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../builders");
const template_1 = require("../template");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');
exports.LEADERBOARD = new template_1.Command()
    .addIdentifiers('leaderboard')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
    interaction.reply({
        embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client.housePointManager.sorted)],
        ephemeral: true
    }).catch(console.debug);
});
