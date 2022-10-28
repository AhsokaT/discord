"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardEmbed = exports.BanButton = exports.RevokeBanButton = exports.HouseInfoButton = exports.LeaderboardButton = exports.UserInfoButton = void 0;
const discord_js_1 = require("discord.js");
const housePicker_1 = require("./House/housePicker");
const UserInfoButton = (user, label = 'User') => new discord_js_1.ButtonBuilder()
    .setCustomId(`USERINFO_${user}`)
    .setStyle(discord_js_1.ButtonStyle.Primary)
    .setLabel(label);
exports.UserInfoButton = UserInfoButton;
const LeaderboardButton = (label = 'Leaderboard') => new discord_js_1.ButtonBuilder()
    .setCustomId('LEADERBOARD')
    .setStyle(discord_js_1.ButtonStyle.Primary)
    .setLabel(label);
exports.LeaderboardButton = LeaderboardButton;
const HouseInfoButton = (house, label = 'House') => new discord_js_1.ButtonBuilder()
    .setCustomId(`HOUSEINFO_${house}`)
    .setStyle(discord_js_1.ButtonStyle.Primary)
    .setLabel(label);
exports.HouseInfoButton = HouseInfoButton;
const RevokeBanButton = (user, label = 'Revoke ban') => new discord_js_1.ButtonBuilder()
    .setCustomId(`UNBAN_${user}`)
    .setStyle(discord_js_1.ButtonStyle.Primary)
    .setLabel(label);
exports.RevokeBanButton = RevokeBanButton;
const BanButton = (user, label = 'Ban') => new discord_js_1.ButtonBuilder()
    .setCustomId(`BAN_${user}`)
    .setStyle(discord_js_1.ButtonStyle.Danger)
    .setLabel(label);
exports.BanButton = BanButton;
function houseEmbedField(house, points) {
    return { name: house, value: `${points} points` };
}
const LeaderboardEmbed = (sorted) => new discord_js_1.EmbedBuilder()
    .setColor('#2F3136')
    .setTimestamp()
    .addFields(...sorted.map(([name, points]) => [housePicker_1.House[name], points]).map(data => houseEmbedField(...data)));
exports.LeaderboardEmbed = LeaderboardEmbed;
