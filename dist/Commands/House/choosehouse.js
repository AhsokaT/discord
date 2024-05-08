"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSES = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const housePicker_1 = require("./housePicker");
const SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('choosehouse')
    .setDescription('Choose your house!');
exports.HOUSES = new template_1.Command()
    .addIdentifiers('choosehouse', 'CHOOSEHOUSE', 'HOUSEUNSURE2')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
    if (interaction.member.roles.cache.hasAny(housePicker_1.RoleID.TIGER, housePicker_1.RoleID.OWL, housePicker_1.RoleID.RAVEN, housePicker_1.RoleID.TURTLE, housePicker_1.RoleID.PANDA))
        return void interaction.reply({ content: 'You have already joined a house!', ephemeral: true });
    const actionRow = new discord_js_1.ActionRowBuilder();
    const buttons = ['Tiger', 'Owl', 'Raven', 'Turtle', 'Panda'].map(house => house.toUpperCase()).map(house => new discord_js_1.ButtonBuilder()
        .setCustomId(`CHOOSEHOUSE_${house}`)
        .setLabel(housePicker_1.House[house])
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setEmoji(housePicker_1.HouseEmoji[house]));
    actionRow.addComponents(buttons);
    interaction.reply({ content: 'Choose your house below!', components: [actionRow], ephemeral: true });
})
    .onButton(interaction => {
    if (interaction.customId.startsWith('CHOOSEHOUSE')) {
        const house = interaction.customId.split('_').pop();
        const actionRow = new discord_js_1.ActionRowBuilder();
        actionRow.addComponents(new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setLabel('I\'m not sure yet')
            .setCustomId(`HOUSEUNSURE2`), new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Success)
            .setLabel('Sign me up!')
            .setCustomId(`HOUSECONFIRM_${house}`));
        interaction.update({
            content: `You can only join a house once, are you sure you want to join **${housePicker_1.House[house]}** <@&${housePicker_1.RoleID[house]}>?`,
            components: [actionRow]
        });
    }
    else if (interaction.customId === 'HOUSEUNSURE2') {
        const actionRow = new discord_js_1.ActionRowBuilder();
        const buttons = ['TIGER', 'OWL', 'RAVEN', 'TURTLE', 'PANDA'].map(house => new discord_js_1.ButtonBuilder()
            .setCustomId(`CHOOSEHOUSE_${house}`)
            .setLabel(housePicker_1.House[house])
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setEmoji(housePicker_1.HouseEmoji[house]));
        actionRow.addComponents(buttons);
        interaction.update({
            content: 'Choose your house below!',
            components: [actionRow]
        });
    }
});
