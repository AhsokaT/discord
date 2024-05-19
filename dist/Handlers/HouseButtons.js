"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseButtons = void 0;
const discord_js_1 = require("discord.js");
const enum_1 = require("../Util/enum");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const builders_1 = require("../Util/builders");
let HouseButtons = class HouseButtons extends framework_1.InteractionHandler {
    async run(interaction) {
        if (/^(CHOOSEHOUSE)/.test(interaction.customId)) {
            const houseId = interaction.customId.split('_').pop();
            const actionRow = new discord_js_1.ActionRowBuilder();
            const house = enum_1.House[houseId];
            actionRow.addComponents(new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setLabel('I\'m not sure yet')
                .setCustomId(`HOUSEUNSURE`), new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setLabel('Sign me up!')
                .setCustomId(`HOUSECONFIRM_${house}`));
            interaction.update({
                content: `You can only join a house once, are you sure you want to join **${house.name}** <@&${house.roleId}>?`,
                embeds: [],
                components: [actionRow]
            });
        }
        else if (/^(HOUSEUNSURE)/.test(interaction.customId)) {
            const actionRow = new discord_js_1.ActionRowBuilder();
            const buttons = enum_1.House.ALL.map(house => new discord_js_1.ButtonBuilder()
                .setCustomId(`CHOOSEHOUSE_${house.id}`)
                .setLabel(house.name)
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setEmoji(house.emoji));
            actionRow.addComponents(buttons);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('#2F3136')
                .setTitle('Choose your house')
                .setDescription('You can only join a house once, choose wisely!')
                .addFields(enum_1.House.ALL.map(house => ({ name: `${house.emoji} ${house.name}`, value: `<@&${house.roleId}> ${house.description}` })));
            interaction.update({ content: '', embeds: [embed], components: [actionRow] });
        }
        else if (/^(HOUSECONFIRM)/.test(interaction.customId)) {
            if (!interaction.inCachedGuild())
                return void interaction.reply({ content: 'error', ephemeral: true });
            const selection = interaction.customId.split('_').pop();
            const house = enum_1.House[selection];
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
                return console.error(err);
            }
            try {
                await interaction.member.roles.add(house.roleId);
            }
            catch (err) {
                interaction.editReply({ content: ':x: There was an error assigning your house, try again later', components: [] }).catch(console.debug);
                return console.error(err);
            }
            interaction.editReply({ content: `You have successfully joined **${enum_1.House[selection]}**! You now have access to <#${house.channelId}>`, components: [] }).catch(console.debug);
            const logs = await interaction.client.channels.fetch(enum_1.ChannelId.Logs);
            logs.send({
                content: `${interaction.user} **became ${selection === 'OWL' ? 'an' : 'a'}** <@&${house.roleId}>`,
                components: [
                    new discord_js_1.ActionRowBuilder()
                        .addComponents((0, builders_1.UserInfoButton)(interaction.user.id, 'Member'), (0, builders_1.HouseInfoButton)(selection))
                ],
                allowedMentions: { parse: [] }
            }).catch(console.error);
            const channel = await interaction.guild.channels.fetch(house.channelId);
            channel.send(`<@&${house.roleId}> ${interaction.user} **has joined the house!** Give them a warm welcome! :smile:`)
                .then(message => {
                message.react('🥳');
                message.react(house.emoji);
            })
                .catch(console.error);
        }
    }
    parse(interaction) {
        return /^(CHOOSEHOUSE|HOUSEUNSURE|HOUSECONFIRM)/.test(interaction.customId) ? this.some() : this.none();
    }
};
exports.HouseButtons = HouseButtons;
exports.HouseButtons = HouseButtons = __decorate([
    (0, decorators_1.ApplyOptions)({
        interactionHandlerType: framework_1.InteractionHandlerTypes.Button
    })
], HouseButtons);
framework_1.container.stores.loadPiece({
    piece: HouseButtons,
    name: HouseButtons.name,
    store: 'interaction-handlers'
});
