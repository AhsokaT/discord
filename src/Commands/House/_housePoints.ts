import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { ChannelID, Client } from '../../client';
import { HousePoints } from '../../housePoints';
import { allPointChangeEmbed, LeaderboardButton, pointChangeButton, pointChangeEmbed, UserInfoButton } from '../builders';
import { Command } from '../template';
import { House } from './housePicker';
import { HouseID } from './HousePointManager';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('housepoints')
    .setDescription('Add or remove points from any house')
    .addIntegerOption(option => option
        .setName('tigers')
        .setDescription('New total')
    )
    .addIntegerOption(option => option
        .setName('owls')
        .setDescription('New total')
    )
    .addIntegerOption(option => option
        .setName('ravens')
        .setDescription('New total')
    )
    .addIntegerOption(option => option
        .setName('pandas')
        .setDescription('New total')
    )
    .addIntegerOption(option => option
        .setName('turtles')
        .setDescription('New total')
    );


export const HOUSE_POINTS = new Command()
    .addIdentifiers('housepoints')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async interaction => {
        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client as Client;
        const manager = client.housePointManager;
        const current = new HousePoints(manager.cache);

        const newTotals = Object.keys(House).reduce((acc, h) => Object.assign(acc[h], interaction.options.getInteger(h.toUpperCase().replace('s', '')) ?? current[h]), new HousePoints());

        const changes = current.difference(newTotals);

        
    });