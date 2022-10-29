import { ActionRowBuilder, MessageActionRowComponentBuilder, SlashCommandBuilder, messageLink } from 'discord.js';
import { Client } from '../../client';
import { buildChangesMessage, LeaderboardButton, LeaderboardEmbed, UndoChangesButton, UserInfoButton } from '../builders';
import { Command } from '../template';
import { House, RoleID } from './housePicker';
import { HousePoints } from './HousePointManager';

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

export const UNDO_POINTS = new Command()
    .addIdentifiers('UNDO')
    .onButton(async interaction => {
        await interaction.update({ components: [] }).catch(console.debug);

        const client = interaction.client as Client;
        const changes = JSON.parse(interaction.customId.split('_')[1]) as HousePoints;
        const before = client.housePointManager.cache;

        if (changes.TIGER)
            await client.housePointManager.addPoints('TIGER', -changes.TIGER, false);

        if (changes.OWL)
            await client.housePointManager.addPoints('OWL', -changes.OWL, false);

        if (changes.RAVEN)
            await client.housePointManager.addPoints('RAVEN', -changes.RAVEN, false);

        if (changes.TURTLE)
            await client.housePointManager.addPoints('TURTLE', -changes.TURTLE, false);

        if (changes.PANDA)
            await client.housePointManager.addPoints('PANDA', -changes.PANDA, false);

        client.database.closeConnection().catch(console.debug);

        interaction.editReply({
            content: buildChangesMessage(before, client.housePointManager.cache),
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UndoChangesButton(JSON.stringify({
                    TIGER: -changes.TIGER,
                    OWL: -changes.OWL,
                    RAVEN: -changes.RAVEN,
                    TURTLE: -changes.TURTLE,
                    PANDA: -changes.PANDA
                }), interaction.component.label?.startsWith('Undo') ? 'Redo changes' : 'Undo changes'))
            ]
        }).catch(console.debug);
    });

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

        client.database.closeConnection().catch(console.debug);

        interaction.editReply({
            content: buildChangesMessage(before, client.housePointManager.cache),
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UndoChangesButton(JSON.stringify({
                    TIGER: tigers,
                    OWL: owls,
                    RAVEN: ravens,
                    TURTLE: turtles,
                    PANDA: pandas
                })))
            ]
        }).catch(console.debug);

        client.sendToLogChannel({
            content: buildChangesMessage(before, client.housePointManager.cache),
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    UserInfoButton(interaction.user.id, 'Changed by'),
                    LeaderboardButton()
                )
            ]
        }).catch(console.debug);

        client.sendToCompetitionsChannel({
            content: buildChangesMessage(before, client.housePointManager.cache),
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    UserInfoButton(interaction.user.id, 'Changed by'),
                    LeaderboardButton()
                )
            ]
        }).catch(console.debug);
    });