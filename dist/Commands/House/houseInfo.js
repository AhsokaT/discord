"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_INFO = exports.Ordinal = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("../template");
const housePicker_1 = require("./housePicker");
exports.Ordinal = {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: '4th',
    5: '5th'
};
exports.HOUSE_INFO = new template_1.Command()
    .addIdentifiers('HOUSEINFO')
    .onButton(async (interaction) => {
    const client = interaction.client;
    const pointManager = client.housePointManager;
    const house = interaction.customId.split('_').pop();
    if (!house)
        return void interaction.deferUpdate().catch(console.debug);
    const cachedMembers = interaction.guild.members.cache.filter(member => member.roles.cache.has(housePicker_1.RoleID[house]));
    let position = pointManager.sorted.map(([name]) => name).indexOf(house);
    let houses = pointManager.sorted.filter(([_, points]) => points === pointManager.sorted[position][1]).sort((a, b) => b[1] - a[1]);
    position = pointManager.sorted.map(([name]) => name).indexOf(houses[0][0]);
    const value = houses.length > 1 ? `Joint **${exports.Ordinal[position + 1]}** with ${houses.filter(([name]) => name !== house).map(([name]) => `<@&${housePicker_1.RoleID[name]}>`).join(', ')}` : `**${exports.Ordinal[position + 1]}** with **${pointManager.cache[house]} points**`;
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(housePicker_1.House[house])
        .setDescription(`<@&${housePicker_1.RoleID[house]}> ${housePicker_1.HouseDescription[house]}`)
        .addFields({
        name: 'Position on leaderboard',
        value,
        inline: true
    });
    if (cachedMembers.size > 0)
        embed.addFields({
            name: 'Cached members',
            value: [...cachedMembers.values()].join(' '),
            inline: true
        });
    interaction.reply({ embeds: [embed], ephemeral: true, allowedMentions: { parse: [] } }).catch(console.debug);
});
