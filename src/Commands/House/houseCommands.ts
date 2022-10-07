import { SlashCommandBuilder } from 'discord.js';
import { Client } from '../../client';
import { Command } from '../template';
import { House } from './house';
import { HouseParticipants } from './HousePointManager';

function houseOption(name: string) {
    return { name: House[name], value: name };
}

const ASSIGN_POINTS = new SlashCommandBuilder()
    .setName('assignpoints')
    .setDescription('WIP')
    .addStringOption(builder => builder
        .setName('house')
        .setDescription('House to assign points to')
        .addChoices(...Object.keys(House).map(houseOption))
        .setRequired(true)
    )
    .addIntegerOption(builder => builder
        .setName('points')
        .setDescription('The number of points to assign')
        .setRequired(true)
    );

const REMOVE_POINTS = new SlashCommandBuilder()
        .setName('removepoints')
        .setDescription('WIP')
        .addStringOption(builder => builder
            .setName('house')
            .setDescription('House to assign points to')
            .addChoices(...Object.keys(House).map(houseOption))
            .setRequired(true)
        )
        .addIntegerOption(builder => builder
            .setName('points')
            .setDescription('The number of points to assign')
            .setRequired(true)
        );

export const ASSIGN_POINTS_COMMAND = new Command()
    .addIdentifiers('assignpoints')
    .addGuilds(process.env.DAILY_OFFENDERS!)
    .addBuilders(ASSIGN_POINTS)
    .onChatInputCommand(interaction => {
        const house = interaction.options.getString('house', true) as HouseParticipants;
        const points = interaction.options.getInteger('points', true);

        (interaction.client as Client).housePointManager.assignPoints(house, points);

        interaction.reply({ content: `:partying_face: Assigned **${points} points** to **${House[house]}**`, ephemeral: true }).catch(console.debug);
    });

export const REMOVE_POINTS_COMMAND = new Command()
    .addIdentifiers('removepoints')
    .addGuilds(process.env.DAILY_OFFENDERS!)
    .addBuilders(REMOVE_POINTS)
    .onChatInputCommand(interaction => {
        const house = interaction.options.getString('house', true) as HouseParticipants;
        const points = interaction.options.getInteger('points', true);

        (interaction.client as Client).housePointManager.removePoints(house, points);

        interaction.reply({ content: `:confused: Deducted **${points} points** from **${House[house]}**`, ephemeral: true }).catch(console.debug);
    });
