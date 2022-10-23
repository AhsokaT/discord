"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADJUST_POINTS_COMMAND = void 0;
const discord_js_1 = require("discord.js");
const misc_1 = require("../../misc");
const builders_1 = require("../builders");
const template_1 = require("../template");
const house_1 = require("./house");
function houseOption(name) {
    return { name: house_1.House[name], value: name };
}
const ADJUST_POINTS = new discord_js_1.SlashCommandBuilder()
    .setName('adjustpoints')
    .setDescription('Adjust house points')
    .addStringOption(option => option
    .setName('house')
    .setDescription('House to assign points to')
    .addChoices(...Object.keys(house_1.House).map(houseOption))
    .setRequired(true))
    .addIntegerOption(option => option
    .setName('points')
    .setDescription('The number of points to assign')
    .setRequired(true))
    .addStringOption(option => option
    .setName('reason')
    .setDescription('Reason for point adjustment')
    .setRequired(true));
exports.ADJUST_POINTS_COMMAND = new template_1.Command()
    .addIdentifiers('adjustpoints')
    .addGuilds('509135025560616963')
    .addBuilders(ADJUST_POINTS)
    .onChatInputCommand(async (interaction) => {
    const house = interaction.options.getString('house', true);
    const points = interaction.options.getInteger('points', true);
    const reason = interaction.options.getString('reason', true);
    if (points === 0)
        return void interaction.reply({ content: 'What do you expect me to do with zero points?', ephemeral: true }).catch(console.debug);
    await interaction.deferReply({ ephemeral: true }).catch(console.debug);
    interaction.client.housePointManager.adjustPoints(house, points);
    const content = points < 0 ? `**${points * -1} points removed** from <@&${house_1.RoleID[house]}>\n\`• Reason\` ${reason}` : `**${points} points added** to <@&${house_1.RoleID[house]}>\n\`• Reason\` ${reason}`;
    (0, misc_1.sendToLogChannel)(interaction.client, {
        content,
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(interaction.user.id, `${points < 0 ? 'Removed' : 'Added'} by`), (0, builders_1.HouseInfoButton)(house))
        ],
        allowedMentions: { parse: [] }
    })
        .then(log => interaction.editReply({
        content: points < 0 ? `:confused: Removed **${points * -1} points** from **${house_1.House[house]}** <@&${house_1.RoleID[house]}>` : `:partying_face: Added **${points} points** to **${house_1.House[house]}** <@&${house_1.RoleID[house]}>`,
        components: [
            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setLabel('Log')
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setURL(log.url))
        ],
        allowedMentions: { parse: [] }
    }))
        .catch(console.debug);
});
