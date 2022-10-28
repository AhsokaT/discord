import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from '../../client';
import { MongoClientStatus } from '../../DataBase/DataBase';
import { LeaderboardButton, UserInfoButton } from '../builders';
import { Command } from '../template';
import { House, RoleID } from './housePicker';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('housepoints')
    .setDescription('Add or remove points from any house')
    .addIntegerOption(option => option
        .setName('tigers')
        .setDescription('The number of points to add or remove')
    )
    .addIntegerOption(option => option
        .setName('owls')
        .setDescription('The number of points to add or remove')
    )
    .addIntegerOption(option => option
        .setName('ravens')
        .setDescription('The number of points to add or remove')
    )
    .addIntegerOption(option => option
        .setName('pandas')
        .setDescription('The number of points to add or remove')
    )
    .addIntegerOption(option => option
        .setName('turtles')
        .setDescription('The number of points to add or remove')
    );

export const HOUSE_POINTS = new Command()
    .addIdentifiers('housepoints')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async interaction => {
        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client as Client;
        const tigers = interaction.options.getInteger('tigers');
        const owls = interaction.options.getInteger('owls');
        const ravens = interaction.options.getInteger('ravens');
        const turtles = interaction.options.getInteger('turtles');
        const pandas = interaction.options.getInteger('pandas');

        if (!tigers && !owls && !ravens && !turtles && !pandas)
            return interaction.editReply(':x: You must specify at least one house to add or remove points from');

        const before = client.housePointManager.cache;

        if (tigers)
            await client.housePointManager.addPoints('TIGER', tigers, false);

        if (owls)
            await client.housePointManager.addPoints('OWL', owls, false);

        if (ravens)
            await client.housePointManager.addPoints('RAVEN', ravens, false);

        if (turtles)
            await client.housePointManager.addPoints('TURTLE', turtles, false);

        if (pandas)
            await client.housePointManager.addPoints('PANDA', pandas, false);

        if (client.database.status === MongoClientStatus.Connected) {
            client.database.client.close();

            client.database.status = MongoClientStatus.Disconnected;
        }

        interaction.editReply('👍 **Changes applied**').catch(console.debug);

        const logMessage = Object.keys(House).reduce((acc, house) => {
            const change = interaction.options.getInteger(house.toLowerCase() + 's');

            if (change)
                return acc + `\n<@&${RoleID[house]}> **\`${before[house]} -> ${client.housePointManager.cache[house]}\`** ${change < 0 ? change * -1 : change} points ${change > 0 ? 'added' : 'removed'}`;

            return acc;
        }, '');

        client.sendToLogChannel({
            content: logMessage,
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    UserInfoButton(interaction.user.id, 'Changed by'),
                    LeaderboardButton()
                )
            ]
        }).catch(console.debug);

        client.sendToCompetitionsChannel({
            content: logMessage,
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    UserInfoButton(interaction.user.id, 'Changed by'),
                    LeaderboardButton()
                )
            ]
        }).catch(console.debug);
    });