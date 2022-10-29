"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_POINTS = exports.UNDO_POINTS = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../builders");
const template_1 = require("../template");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('housepoints')
    .setDescription('Add or remove points from any house')
    .addIntegerOption(option => option
    .setName('tigers')
    .setDescription('The number of points to add or remove'))
    .addIntegerOption(option => option
    .setName('owls')
    .setDescription('The number of points to add or remove'))
    .addIntegerOption(option => option
    .setName('ravens')
    .setDescription('The number of points to add or remove'))
    .addIntegerOption(option => option
    .setName('pandas')
    .setDescription('The number of points to add or remove'))
    .addIntegerOption(option => option
    .setName('turtles')
    .setDescription('The number of points to add or remove'));
exports.UNDO_POINTS = new template_1.Command()
    .addIdentifiers('UNDO')
    .onButton(async (interaction) => {
    await interaction.update({ components: [] }).catch(console.debug);
    const client = interaction.client;
    const changes = JSON.parse(interaction.customId.split('_')[1]);
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
        content: (0, builders_1.buildChangesMessage)(before, client.housePointManager.cache),
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UndoChangesButton)(JSON.stringify({
                TIGER: -changes.TIGER,
                OWL: -changes.OWL,
                RAVEN: -changes.RAVEN,
                TURTLE: -changes.TURTLE,
                PANDA: -changes.PANDA
            }), interaction.component.label?.startsWith('Undo') ? 'Redo changes' : 'Undo changes'))
        ]
    }).catch(console.debug);
});
exports.HOUSE_POINTS = new template_1.Command()
    .addIdentifiers('housepoints')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const client = interaction.client;
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
        content: (0, builders_1.buildChangesMessage)(before, client.housePointManager.cache),
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UndoChangesButton)(JSON.stringify({
                TIGER: tigers,
                OWL: owls,
                RAVEN: ravens,
                TURTLE: turtles,
                PANDA: pandas
            })))
        ]
    }).catch(console.debug);
    client.sendToLogChannel({
        content: (0, builders_1.buildChangesMessage)(before, client.housePointManager.cache),
        allowedMentions: { parse: [] },
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(interaction.user.id, 'Changed by'), (0, builders_1.LeaderboardButton)())
        ]
    }).catch(console.debug);
    client.sendToCompetitionsChannel({
        content: (0, builders_1.buildChangesMessage)(before, client.housePointManager.cache),
        allowedMentions: { parse: [] },
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(interaction.user.id, 'Changed by'), (0, builders_1.LeaderboardButton)())
        ]
    }).catch(console.debug);
});
