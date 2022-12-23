import { ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake } from 'discord.js';
import { Client } from '../client';
import { Ordinal } from './House/houseInfo';
import { House, RoleID } from './House/housePicker';
import { HouseID, HousePoints } from './House/HousePointManager';

export function buildChangesMessage(before: HousePoints, after: HousePoints) {
    return Object.keys(House).reduce((acc, house) => {
        if (before[house] === after[house])
            return acc;

        const diff = Math.abs(before[house] - after[house]);

        return acc + `\n<@&${RoleID[house]}> **\`${before[house]} -> ${after[house]}\`** ${diff} points ${before[house] < after[house] ? 'added' : 'removed'}`;
    }, '');
}

export const UpdateLeaderboardButton = (label = 'Refresh') => new ButtonBuilder()
    .setCustomId('UPDATELEADERBOARD')
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const UserInfoButton = (user: Snowflake, label = 'User') => new ButtonBuilder()
    .setCustomId(`USERINFO_${user}`)
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const UndoChangesButton = (changes: string, label = 'Undo changes') => new ButtonBuilder()
    .setCustomId(`UNDO_${changes}`)
    .setStyle(ButtonStyle.Danger)
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
    .setStyle(ButtonStyle.Primary)
    .setLabel(label);

export const BanButton = (user: Snowflake, label = 'Ban') => new ButtonBuilder()
    .setCustomId(`BAN_${user}`)
    .setStyle(ButtonStyle.Danger)
    .setLabel(label);

function houseEmbedField(house: string, points: [string, number][]) {
    return {
        name: `${Ordinal[points.findIndex(([name]) => name === house) + 1]} ${House[house]}`,
        value: `<@&${RoleID[house]}> ${points.find(([name]) => name === house)![1]} points`
    };
}

export const LeaderboardEmbed = (client: Client<true>) => new EmbedBuilder()
    .setColor('#2F3136')
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ size: 4096 }) })
    .setDescription(`Updated <t:${Math.round(Date.now() / 1000)}:R>`)
    .addFields(...client.housePointManager.sorted.map(([house]) => house).map(house => houseEmbedField(house, client.housePointManager.sorted)));