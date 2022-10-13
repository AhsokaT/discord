"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_COMMAND = exports.RoleID = exports.HouseDescription = exports.House = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
var House;
(function (House) {
    House["TIGER"] = "\uD83D\uDC2F House of Tiger";
    House["OWL"] = "\uD83E\uDD89 100 Acre Wood";
    House["RAVEN"] = "\uD83D\uDC41\uFE0F The Ravens";
    House["TURTLE"] = "\uD83D\uDC22 Kame House";
    House["PANDA"] = "\uD83D\uDC3C Bamboo Forest";
})(House = exports.House || (exports.House = {}));
var HouseDescription;
(function (HouseDescription) {
    HouseDescription["TIGER"] = "Competitive, crud central, Fearless, Rage";
    HouseDescription["OWL"] = "observant, Integrity, judge, They do not speak a lot but when they do, they talk wisely.";
    HouseDescription["RAVEN"] = "The eye of all eyes, Pure Daily Offenders, can be calm or on crud, depending on the tea or tequila!";
    HouseDescription["TURTLE"] = "chill, perseverance, otaku, cosplay & hentai enthusiast! (LOT'S OF NOSE BLEEDS)";
    HouseDescription["PANDA"] = "bashful, emotional, foodie, jokes, sleepy";
})(HouseDescription = exports.HouseDescription || (exports.HouseDescription = {}));
var RoleID;
(function (RoleID) {
    RoleID["TIGER"] = "1024014286416261191";
    RoleID["OWL"] = "1024014430448660490";
    RoleID["RAVEN"] = "1024014477789773965";
    RoleID["TURTLE"] = "1024014510723432478";
    RoleID["PANDA"] = "1024014614536667239";
})(RoleID = exports.RoleID || (exports.RoleID = {}));
exports.HOUSE_COMMAND = new template_1.Command()
    .addIdentifiers('HOUSE', 'HOUSECONFIRM')
    .onButton(async (interaction) => {
    if (!interaction.customId.startsWith('HOUSECONFIRM'))
        return;
    const selection = interaction.customId.split('_').pop();
    if (!selection)
        return console.error('Selection not included in custom ID');
    try {
        await interaction.update({
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setLabel('Sign me up!')
                    .setCustomId(`HOUSECONFIRM_${selection}`)
                    .setDisabled(true))
            ]
        });
    }
    catch (err) {
        return console.debug(err);
    }
    try {
        await interaction.member.roles.add(RoleID[selection]);
    }
    catch (err) {
        interaction.editReply({ content: ':x: There was an error assigning your house, try again later', components: [] }).catch(console.debug);
        return console.error(err);
    }
    interaction.editReply({ content: `You have successfully joined **${House[selection]}**`, components: [] }).catch(console.debug);
})
    .onSelectMenu(interaction => {
    const [selection] = interaction.values;
    if (!selection) {
        console.debug('Select Menu Interaction did not include values');
        return void interaction.reply({ ephemeral: true, content: 'There was an error with your selection' }).catch(console.debug);
    }
    if (interaction.member.roles.cache.hasAny(...Object.values(RoleID)))
        return void interaction.reply({ content: 'You cannot join another house', ephemeral: true }).catch(console.debug);
    interaction.reply({
        ephemeral: true,
        content: `Are you sure you want to join **${House[selection]}**? You can dismiss this message if you want to reconsider`,
        components: [
            new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setLabel('Sign me up!')
                .setCustomId(`HOUSECONFIRM_${selection}`))
        ]
    }).catch(console.debug);
});
