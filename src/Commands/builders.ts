import { ButtonBuilder, ButtonStyle, EmbedBuilder, Snowflake } from 'discord.js';
import { House } from './House/housePicker';
import { HouseID } from './House/HousePointManager';

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