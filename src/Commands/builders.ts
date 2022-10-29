import { ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake } from 'discord.js';
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

function houseEmbedField(house: string, points: number) {
    return { name: house, value: `${points} points` };
}

export const LeaderboardEmbed = (sorted: [string, number][]) => new EmbedBuilder()
    .setColor('#2F3136')
    .setTimestamp()
    .addFields(...sorted.map(([name, points]) => [House[name], points] as [string, number]).map(data => houseEmbedField(...data)));