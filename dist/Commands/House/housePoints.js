"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_POINTS = void 0;
const discord_js_1 = require("discord.js");
const DataBase_1 = require("../../DataBase/DataBase");
const builders_1 = require("../builders");
const template_1 = require("../template");
const housePicker_1 = require("./housePicker");
const housePicker_2 = require("./housePicker");
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
    if (client.database.status === DataBase_1.MongoClientStatus.Connected) {
        client.database.client.close();
        client.database.status = DataBase_1.MongoClientStatus.Disconnected;
    }
    interaction.editReply('👍 **Changes applied**').catch(console.debug);
    const logMessage = Object.keys(housePicker_1.House).reduce((acc, house) => {
        const change = interaction.options.getInteger(house.toLowerCase() + 's');
        if (change)
            return acc + `\n<@&${housePicker_2.RoleID[house]}> **\`${before[house]} -> ${client.housePointManager.cache[house]}\`** ${change < 0 ? change * -1 : change} points ${change > 0 ? 'added' : 'removed'}`;
        return acc;
    }, '');
    client.sendToLogChannel({
        content: logMessage,
        allowedMentions: { parse: [] },
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(interaction.user.id, 'Changed by'), (0, builders_1.LeaderboardButton)())
        ]
    }).catch(console.debug);
    client.sendToCompetitionsChannel({
        content: logMessage,
        allowedMentions: { parse: [] },
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(interaction.user.id, 'Changed by'), (0, builders_1.LeaderboardButton)())
        ]
    }).catch(console.debug);
});
