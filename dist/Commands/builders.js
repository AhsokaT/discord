"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardEmbed = exports.BanButton = exports.RevokeBanButton = exports.HouseInfoButton = exports.LeaderboardButton = exports.UserInfoButton = exports.DeleteInteractionButton = exports.UpdateLeaderboardButton = exports.allPointChangeEmbed = exports.pointChangeEmbed = exports.pointChangeButton = void 0;
const discord_js_1 = require("discord.js");
const houseInfo_1 = require("./House/houseInfo");
const housePicker_1 = require("./House/housePicker");
const padLength = (strs) => strs.sort((a, b) => b.length - a.length)[0].length + 1;
// if (points.some(p => p.length > 2))
//     return 4;
// if (points.some(p => p.length > 1))
//     return 3;
// return 2;
function padString(str, points) {
    return str.padStart(padLength(points.map(p => p.toString())), ' ').padEnd(padLength(points.map(p => p.toString())) + 1, ' ');
}
const pointChangeButton = (before, after) => {
    const json = JSON.stringify(Object.keys(before).reduce((acc, h) => Object.assign(acc, { [h]: [before[h], after[h]] }), {}));
    if (json.length > 98)
        return null;
    return new discord_js_1.ButtonBuilder()
        .setCustomId(`P_${json}`)
        .setLabel('See all changes')
        .setStyle(discord_js_1.ButtonStyle.Primary);
};
exports.pointChangeButton = pointChangeButton;
// const _padString = (str: string, length: number) => str.padStart(length, ' ').padEnd(length++, ' ');
// export const reverseString = (str: string) => Array.from(str).reduceRight((acc, c) => acc + c, '');
// export function pointDifferenceString(difference: number) {
//     return `\`${_padString(reverseString(`${difference > 0 ? 'Removed' : 'Added'} ${difference}`), String(difference).length)}\``;
// }
// export function pointUpdateRow(before: HousePoints, after: HousePoints, house: string) {
//     const difference = pointDifferenceString(before[house] - after[house]);
//     return `${difference} \`${_padString(String(before), padLength)}\` → \`${_padString(String(after), padLength)}\` <@&${RoleID[house]}>`;
// }
// export function pointUpdateEmbed(before: HousePoints, after: HousePoints) {
//     return new EmbedBuilder()
//         .setColor('#2F3136')
//         .setTitle('Point update')
//         .setDescription('Loading...');
// }
function pointChangeEmbed(house, before, after) {
    const diff = `${(before - after > 0 ? 'Removed' : 'Added')} ${Math.abs(before - after)} points`;
    return new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Point update')
        .setDescription(`\`${padString(diff, [diff])}\` \`${padString(before.toString(), [before])}\` → \`${padString(after.toString(), [after])}\` <@&${housePicker_1.RoleID[house]}>`);
}
exports.pointChangeEmbed = pointChangeEmbed;
function allPointChangeEmbed(before, after) {
    const allDiff = Object.keys(housePicker_1.House).map(h => before[h] - after[h]).map(d => `${(d > 0 ? 'Removed' : 'Added')} ${Math.abs(d)} points`);
    return new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Point update')
        .setDescription(Object.keys(housePicker_1.House).sort((a, b) => after[b] - after[a]).reduce((acc, house) => {
        if (before[house] === after[house])
            return acc;
        const diff = before[house] - after[house];
        const diffStr = '\`' + [...padString([...`${(diff > 0 ? 'Removed' : 'Added')} ${Math.abs(diff)} points`].reverse().join(''), allDiff)].reverse().join('') + `\``;
        return acc + `\n${diffStr} \`${padString(before[house].toString(), Object.values(before))}\` → \`${padString(after[house].toString(), Object.values(after))}\` <@&${housePicker_1.RoleID[house]}>`;
    }, ''));
}
exports.allPointChangeEmbed = allPointChangeEmbed;
const UpdateLeaderboardButton = (label = 'Refresh') => new discord_js_1.ButtonBuilder()
    .setCustomId('UPDATELEADERBOARD')
    .setStyle(discord_js_1.ButtonStyle.Primary)
    .setLabel(label);
exports.UpdateLeaderboardButton = UpdateLeaderboardButton;
const DeleteInteractionButton = () => new discord_js_1.ButtonBuilder()
    .setCustomId('DELETEINTERACTION')
    .setStyle(discord_js_1.ButtonStyle.Danger)
    .setEmoji('🗑️');
exports.DeleteInteractionButton = DeleteInteractionButton;
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
    .setStyle(discord_js_1.ButtonStyle.Danger)
    .setLabel(label);
exports.RevokeBanButton = RevokeBanButton;
const BanButton = (user, label = 'Ban') => new discord_js_1.ButtonBuilder()
    .setCustomId(`BAN_${user}`)
    .setStyle(discord_js_1.ButtonStyle.Danger)
    .setLabel(label);
exports.BanButton = BanButton;
function housePosition([h, p], index, all) {
    return `\n\`${padString(houseInfo_1.Ordinal[index + 1], Object.values(houseInfo_1.Ordinal))}\` \`${padString(`${p} points`, all.map(([_, p]) => `${p} points`))}\` <@&${housePicker_1.RoleID[h]}>`;
}
const LeaderboardEmbed = (client) => new discord_js_1.EmbedBuilder()
    .setColor('#2F3136')
    .setTitle('Leaderboard')
    .setDescription(client.housePointManager.sorted.reduce((acc, h, i, a) => acc + housePosition(h, i, a), `Refreshed <t:${Math.round(Date.now() / 1000)}:R>\n`));
exports.LeaderboardEmbed = LeaderboardEmbed;
