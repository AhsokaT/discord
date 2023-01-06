"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEADERBOARD = exports.UPDATE_LEADERBOARD = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../builders");
const template_1 = require("../template");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');
exports.UPDATE_LEADERBOARD = new template_1.Command()
    .addIdentifiers('UPDATELEADERBOARD')
    .onButton(interaction => interaction.update({
    embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client)]
}).catch(console.debug));
exports.LEADERBOARD = new template_1.Command()
    .addIdentifiers('leaderboard', 'LEADERBOARD')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onButton(interaction => interaction.reply({
    embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client)],
    components: [
        new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UpdateLeaderboardButton)())
    ],
    ephemeral: true,
    allowedMentions: { parse: [] }
}).catch(console.debug))
    .onChatInputCommand(interaction => interaction.reply({
    embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client)],
    components: [
        new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UpdateLeaderboardButton)())
    ],
    ephemeral: true,
    allowedMentions: { parse: [] }
}).catch(console.debug));
