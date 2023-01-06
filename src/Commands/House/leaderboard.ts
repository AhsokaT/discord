import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from '../../client';
import { LeaderboardEmbed, UpdateLeaderboardButton } from '../builders';
import { Command } from '../template';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');

export const UPDATE_LEADERBOARD = new Command()
    .addIdentifiers('UPDATELEADERBOARD')
    .onButton(interaction => interaction.update({
        embeds: [LeaderboardEmbed(interaction.client as Client)]
    }).catch(console.debug));

export const LEADERBOARD = new Command()
    .addIdentifiers('leaderboard', 'LEADERBOARD')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onButton(interaction => interaction.reply({
        embeds: [LeaderboardEmbed(interaction.client as Client)],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UpdateLeaderboardButton())
        ],
        ephemeral: true,
        allowedMentions: { parse: [] }
    }).catch(console.debug))
    .onChatInputCommand(interaction => interaction.reply({
        embeds: [LeaderboardEmbed(interaction.client as Client)],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UpdateLeaderboardButton())
        ],
        ephemeral: true,
        allowedMentions: { parse: [] }
    }).catch(console.debug));