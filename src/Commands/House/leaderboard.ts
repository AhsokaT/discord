import { SlashCommandBuilder } from 'discord.js';
import { Client } from '../../client';
import { LeaderboardEmbed } from '../builders';
import { Command } from '../template';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');

export const LEADERBOARD = new Command()
    .addIdentifiers('leaderboard')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
        interaction.reply({
            embeds: [LeaderboardEmbed((interaction.client as Client).housePointManager.sorted)],
            ephemeral: true
        }).catch(console.debug);
    });