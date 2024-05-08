"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_POINTS = void 0;
const discord_js_1 = require("discord.js");
const client_1 = require("../../client");
const builders_1 = require("../builders");
const template_1 = require("../template");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('housepoints')
    .setDescription('Add or remove points from any house')
    .addIntegerOption(option => option
    .setName('tigers')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('owls')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('ravens')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('pandas')
    .setDescription('New total'))
    .addIntegerOption(option => option
    .setName('turtles')
    .setDescription('New total'))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild);
exports.HOUSE_POINTS = new template_1.Command()
    .addIdentifiers('housepoints')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async (interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const client = interaction.client;
    const manager = client.housePointManager;
    const current = Object.fromEntries(Object.entries(manager.cache));
    const newTotals = {
        TIGER: interaction.options.getInteger('tigers') ?? current.TIGER,
        OWL: interaction.options.getInteger('owls') ?? current.OWL,
        RAVEN: interaction.options.getInteger('ravens') ?? current.RAVEN,
        TURTLE: interaction.options.getInteger('turtles') ?? current.TURTLE,
        PANDA: interaction.options.getInteger('pandas') ?? current.PANDA
    };
    let changes = Object.keys(newTotals)
        .filter(house => newTotals[house] !== current[house])
        .map(house => manager.setPoints(house, newTotals[house], false));
    try {
        await Promise.all(changes);
        await manager.initCache();
    }
    catch (err) {
        console.error(err);
    }
    finally {
        client.database.closeConnection()
            .catch(console.debug);
    }
    Object.keys(newTotals)
        .filter(house => newTotals[house] !== current[house])
        .forEach(house => {
        const changeButton = (0, builders_1.pointChangeButton)(current, newTotals);
        const actionRow = new discord_js_1.ActionRowBuilder();
        if (changeButton)
            actionRow.addComponents(changeButton, (0, builders_1.LeaderboardButton)());
        else
            actionRow.addComponents((0, builders_1.LeaderboardButton)());
        client.sendToChannel(client_1.ChannelID[house], {
            embeds: [(0, builders_1.pointChangeEmbed)(house, current[house], newTotals[house])],
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
            embeds: [(0, builders_1.allPointChangeEmbed)(current, newTotals)],
            allowedMentions: { parse: [] },
            components: [
                new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.LeaderboardButton)())
            ]
        }));
    }
    catch (err) {
        console.error(err);
    }
});
