import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { ChannelID, Client } from '../../client';
import { buildChangesMessage, LeaderboardButton, UserInfoButton } from '../builders';
import { Command } from '../template';
import { Ordinal } from './houseInfo';
import { RoleID } from './housePicker';
import { HousePoints } from './HousePointManager';

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
            .map(house => manager.addPoints(house as keyof HousePoints, newTotals[house] - current[house], false));

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
                const position = manager.sorted.findIndex(([name]) => name === house) + 1;
                const points = newTotals[house] - current[house];

                const content = points > 0 ?
                    `:partying_face: Congratulations <@&${RoleID[house]}> you earned **${points} points!** You are **${Ordinal[position]}** with **${manager.cache[house]} points**` :
                    `:confused: <@&${RoleID[house]}> you lost **${-points} points** >:( do better. You are **${Ordinal[position]}** with **${manager.cache[house]} points**`;

                client.sendToChannel(ChannelID[house], {
                    content,
                    components: [
                        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(LeaderboardButton())
                    ]
                })
                .catch(console.debug);
            });

        const changed = Object.keys(newTotals).some(house => newTotals[house] !== current[house]);

        interaction.editReply({
            content: buildChangesMessage(current, newTotals) || 'No changes were made',
            allowedMentions: { parse: [] }
        }).catch(console.debug);

        if (!changed)
            return;

        try {
            const channels = await Promise.all([client.fetchLogChannel(), client.fetchCompetitionChannel()]);

            channels.forEach(channel => channel.send({
                content: buildChangesMessage(current, newTotals),
                allowedMentions: { parse: [] },
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        UserInfoButton(interaction.user.id, 'Changed by'),
                        LeaderboardButton()
                    )
                ]
            }));
        } catch(err) {
            console.error(err);
        }
    });