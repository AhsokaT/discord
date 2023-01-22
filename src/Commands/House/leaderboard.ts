import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder, RepliableInteraction } from 'discord.js';
import { Client } from '../../client';
import { LeaderboardEmbed, UpdateLeaderboardButton, DeleteLeaderboardButton } from '../builders';
import { Command } from '../template';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See who\'s ahead in the house competitions');

export const UPDATE_LEADERBOARD = new Command()
    .addIdentifiers('UPDATELEADERBOARD')
    .onButton(interaction => interaction.update({
        embeds: [LeaderboardEmbed(interaction.client as Client)]
    }).catch(console.debug));

export const DELETE_LEADERBOARD = new Command()
    .addIdentifiers('DELETELEADERBOARD')
    .onButton(i => i.message.delete().catch(console.debug));

function replyInteraction(interaction: RepliableInteraction) {
    interaction.reply({
        ephemeral: false,
        embeds: [LeaderboardEmbed(interaction.client as Client)],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(UpdateLeaderboardButton(), DeleteLeaderboardButton())
        ],
        allowedMentions: { parse: [] }
    }).catch(console.error);
}

export const LEADERBOARD = new Command()
    .addIdentifiers('leaderboard', 'LEADERBOARD')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onButton(replyInteraction)
    .onChatInputCommand(replyInteraction);