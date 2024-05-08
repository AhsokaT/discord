import { ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake } from 'discord.js';
import { Client } from '../client';
import { Ordinal } from './House/houseInfo';
import { House, RoleID } from './House/housePicker';
import { HouseID, HousePoints } from './House/HousePointManager';

const padLength = (strs: string[]) => strs.sort((a, b) => b.length - a.length)[0].length + 1;

    // if (points.some(p => p.length > 2))
    //     return 4;

    // if (points.some(p => p.length > 1))
    //     return 3;

    // return 2;

function padString(str: string, points: (string | number)[]) {
    return str.padStart(padLength(points.map(p => p.toString())), ' ').padEnd(padLength(points.map(p => p.toString())) + 1, ' ');
}

export const pointChangeButton = (before: HousePoints, after: HousePoints) => {
    const json = JSON.stringify(Object.keys(before).reduce((acc, h) => Object.assign(acc, { [h]: [before[h], after[h]] }), {}));

    if (json.length > 98)
        return null;

    return new ButtonBuilder()
        .setCustomId(`P_${json}`)
        .setLabel('See all changes')
        .setStyle(ButtonStyle.Primary);
}

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

export function pointChangeEmbed(house: HouseID, before: number, after: number) {
    const diff = `${(before - after > 0 ? 'Removed' : 'Added')} ${Math.abs(before - after)} points`;

    return new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Point update')
        .setDescription(`\`${padString(diff, [diff])}\` \`${padString(before.toString(), [before])}\` → \`${padString(after.toString(), [after])}\` <@&${RoleID[house]}>`);
}

export function allPointChangeEmbed(before: HousePoints, after: HousePoints) {
    const allDiff = Object.keys(House).map(h => before[h] - after[h]).map(d => `${(d > 0 ? 'Removed' : 'Added')} ${Math.abs(d)} points`);

    return new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Point update')
        .setDescription(Object.keys(House).sort((a, b) => after[b] - after[a]).reduce((acc, house) => {
            if (before[house] === after[house])
                return acc;

            const diff = before[house] - after[house];

            const diffStr = '\`' + [...padString([...`${(diff > 0 ? 'Removed' : 'Added')} ${Math.abs(diff)} points`].reverse().join(''), allDiff)].reverse().join('') + `\``;

            return acc + `\n${diffStr} \`${padString(before[house].toString(), Object.values(before))}\` → \`${padString(after[house].toString(), Object.values(after))}\` <@&${RoleID[house]}>`;
        }, ''));
}

export const UpdateLeaderboardButton = (label = 'Refresh') => new ButtonBuilder()
    .setCustomId('UPDATELEADERBOARD')
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const DeleteInteractionButton = () => new ButtonBuilder()
    .setCustomId('DELETEINTERACTION')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🗑️');

export const UserInfoButton = (user: Snowflake, label = 'User') => new ButtonBuilder()
    .setCustomId(`USERINFO_${user}`)
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const LeaderboardButton = (label = 'Leaderboard') => new ButtonBuilder()
    .setCustomId('LEADERBOARD')
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const HouseInfoButton = (house: HouseID, label = 'House') => new ButtonBuilder()
    .setCustomId(`HOUSEINFO_${house}`)
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const RevokeBanButton = (user: Snowflake, label = 'Revoke ban') => new ButtonBuilder()
    .setCustomId(`UNBAN_${user}`)
    .setStyle(ButtonStyle.Danger)
    .setLabel(label);

export const BanButton = (user: Snowflake, label = 'Ban') => new ButtonBuilder()
    .setCustomId(`BAN_${user}`)
    .setStyle(ButtonStyle.Danger)
    .setLabel(label);

function housePosition([h, p]: [string, number], index: number, all: [string, number][]) {
    return `\n\`${padString(Ordinal[index + 1], Object.values(Ordinal))}\` \`${padString(`${p} points`, all.map(([_, p]) => `${p} points`))}\` <@&${RoleID[h]}>`;
}

export const LeaderboardEmbed = (client: Client) => new EmbedBuilder()
    .setColor('#2F3136')
    .setTitle('Leaderboard')
    .setDescription(client.housePointManager.sorted.reduce((acc, h, i, a) => acc + housePosition(h, i, a), `Refreshed <t:${Math.round(Date.now() / 1000)}:R>\n`));