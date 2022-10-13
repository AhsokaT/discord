"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_INFO = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const house_1 = require("./house");
const Ordinal = {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: '4th',
    5: '5th'
};
exports.HOUSE_INFO = new template_1.Command()
    .addIdentifiers('HOUSEINFO')
    .onButton(interaction => {
    const client = interaction.client;
    const house = interaction.customId.split('_').pop();
    if (!house)
        return void interaction.deferUpdate().catch(console.debug);
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(house_1.House[house])
        .setDescription(house_1.HouseDescription[house])
        .addFields({
        name: 'Approximate member count',
        value: `${interaction.guild.members.cache.filter(member => member.roles.cache.has(house_1.RoleID[house])).size} <@&${house_1.RoleID[house]}>`,
        inline: true
    }, {
        name: 'Position on leaderboard',
        value: `**${Ordinal[client.housePointManager.sorted.map(([name]) => name).indexOf(house_1.House[house]) + 1]}** with **${client.housePointManager.points[house]} points**`,
        inline: true
    });
    interaction.reply({ embeds: [embed], ephemeral: true, allowedMentions: { parse: [] } }).catch(console.debug);
});
