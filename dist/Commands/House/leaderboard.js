"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEADERBOARD = exports.buildLeaderboard = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const house_1 = require("./house");
function houseField(house, points) {
    return { name: house, value: `${points} points` };
}
const buildLeaderboard = (points) => new discord_js_1.EmbedBuilder()
    .setColor('#2F3136')
    .addFields(...Object.keys(house_1.House).map(house => [house_1.House[house], points[house]]).sort((a, b) => b[1] - a[1]).map(data => houseField(...data)));
exports.buildLeaderboard = buildLeaderboard;
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');
exports.LEADERBOARD = new template_1.Command()
    .addIdentifiers('leaderboard')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
    interaction.reply({
        embeds: [(0, exports.buildLeaderboard)(interaction.client.housePointManager.points).setTimestamp()],
        ephemeral: true
    }).catch(console.debug);
});
