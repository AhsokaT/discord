import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { ChannelID, Client } from '../../client';
import { allPointChangeEmbed, LeaderboardButton, pointChangeButton, pointChangeEmbed, UserInfoButton } from '../builders';
import { Command } from '../template';
import { Ordinal } from './houseInfo';
import { RoleID } from './housePicker';
import { HouseID, HousePoints } from './HousePointManager';

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
        const current = Object.fromEntries(Object.entries(manager.cache)) as HousePoints;

        const newTotals: HousePoints = {
            TIGER: interaction.options.getInteger('tigers') ?? current.TIGER,
            OWL: interaction.options.getInteger('owls') ?? current.OWL,
            RAVEN: interaction.options.getInteger('ravens') ?? current.RAVEN,
            TURTLE: interaction.options.getInteger('turtles') ?? current.TURTLE,
            PANDA: interaction.options.getInteger('pandas') ?? current.PANDA
        };

        let changes = Object.keys(newTotals)
            .filter(house => newTotals[house] !== current[house])
            .map(house => manager.setPoints(house as keyof HousePoints, newTotals[house], false));

        try {
            await Promise.all(changes);

            await manager.initCache();
        } catch(err) {
            console.error(err);
        } finally {
            client.database.closeConnection()
                .catch(console.debug);
        }

        Object.keys(newTotals)
            .filter(house => newTotals[house] !== current[house])
            .forEach(house => {
                const changeButton = pointChangeButton(current, newTotals);

                const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

                if (changeButton)
                    actionRow.addComponents(changeButton, LeaderboardButton());
                else
                    actionRow.addComponents(LeaderboardButton());

                client.sendToChannel(ChannelID[house], {
                    embeds: [pointChangeEmbed(house as HouseID, current[house], newTotals[house])],
                    components: [actionRow]
                })
                .catch(console.debug);
            });

        const changed = Object.keys(newTotals).some(house => newTotals[house] !== current[house]);

        interaction.editReply(changed ? 'Changes made' : 'No changes were made').catch(console.debug);

        if (!changed)
            return;

        try {
            const channels = await Promise.all([client.fetchLogChannel(), client.fetchCompetitionChannel()]);

            channels.forEach(channel => channel.send({
                embeds: [allPointChangeEmbed(current, newTotals)],
                allowedMentions: { parse: [] },
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(LeaderboardButton())
                ]
            }));
        } catch(err) {
            console.error(err);
        }
    });