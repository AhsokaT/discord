import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from '../../client';
import { Command } from '../template';
import { House } from './house';
import { HousePoints } from './HousePointManager';

function houseField(house: string, points: number) {
    return { name: house, value: `${points} points` };
}

export const buildLeaderboard = (points: HousePoints) => new EmbedBuilder()
    .setColor('#2F3136')
    .addFields(...Object.keys(House).map(house => [House[house], points[house]] as [string, number]).sort((a, b) => b[1] - a[1]).map(data => houseField(...data)));

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');

export const LEADERBOARD = new Command()
    .addIdentifiers('leaderboard')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
        interaction.reply({
            embeds: [buildLeaderboard((interaction.client as Client).housePointManager.points).setTimestamp()],
            ephemeral: true
        }).catch(console.debug);
    });