"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePicker = void 0;
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const enum_1 = require("../util/enum");
let HousePicker = class HousePicker extends framework_1.InteractionHandler {
    run(interaction) {
        const [selection] = interaction.values;
        const house = enum_1.House[selection];
        if (!selection) {
            console.debug('Select Menu Interaction did not include values');
            return void interaction.reply({ ephemeral: true, content: 'There was an error with your selection' }).catch(console.debug);
        }
        if (interaction.member.roles.cache.hasAny(...enum_1.House.ALL.map(house => house.roleId)) && interaction.member.user.id !== '451448994128723978')
            return void interaction.reply({ content: 'You cannot join another house', ephemeral: true }).catch(console.debug);
        interaction.reply({
            ephemeral: true,
            content: `Are you sure you want to join **${house.name}** <@&${house.roleId}>? Once you join, you cannot change your house`,
            allowedMentions: { parse: [] },
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setLabel('I\'m not sure yet')
                    .setCustomId(`HOUSEUNSURE`), new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setLabel('Sign me up!')
                    .setCustomId(`HOUSECONFIRM_${selection}`))
            ]
        }).catch(console.debug);
    }
    parse(interaction) {
        return /^HOUSE/.test(interaction.customId) && interaction.inCachedGuild() ? this.some() : this.none();
    }
};
exports.HousePicker = HousePicker;
exports.HousePicker = HousePicker = __decorate([
    (0, decorators_1.ApplyOptions)({
        interactionHandlerType: framework_1.InteractionHandlerTypes.SelectMenu
    })
], HousePicker);
framework_1.container.stores.loadPiece({
    piece: HousePicker,
    name: HousePicker.name,
    store: 'interaction-handlers'
});
