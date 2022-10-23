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
    .onButton(async (interaction) => {
    const client = interaction.client;
    const pointManager = client.housePointManager;
    const house = interaction.customId.split('_').pop();
    if (!house)
        return void interaction.deferUpdate().catch(console.debug);
    const cachedMembers = interaction.guild.members.cache.filter(member => member.roles.cache.has(house_1.RoleID[house]));
    let position = pointManager.sorted.map(([name]) => name).indexOf(house);
    let houses = pointManager.sorted.filter(([_, points]) => points === pointManager.sorted[position][1]).sort((a, b) => b[1] - a[1]);
    position = pointManager.sorted.map(([name]) => name).indexOf(houses[0][0]);
    const value = houses.length > 1 ? `Joint **${Ordinal[position + 1]}** with ${houses.filter(([name]) => name !== house).map(([name]) => `<@&${house_1.RoleID[name]}>`).join(', ')}` : `**${Ordinal[position + 1]}** with **${pointManager.points[house]} points**`;
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(house_1.House[house])
        .setDescription(`<@&${house_1.RoleID[house]}> ${house_1.HouseDescription[house]}`)
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
