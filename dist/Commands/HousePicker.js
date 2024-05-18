"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePicker = void 0;
const discord_js_1 = require("discord.js");
const enum_1 = require("../Util/enum");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
let HousePicker = class HousePicker extends framework_1.Command {
    chatInputRun(interaction) {
        if (!interaction.inCachedGuild())
            return void interaction.reply({ content: 'error', ephemeral: true });
        if (interaction.member.roles.cache.hasAny(...enum_1.House.ALL.map(house => house.roleId)))
            return void interaction.reply({ content: 'You have already joined a house!', ephemeral: true });
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
        interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({ name: this.name, description: this.description }, { guildIds: ['509135025560616963'] });
    }
};
exports.HousePicker = HousePicker;
exports.HousePicker = HousePicker = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: 'choosehouse',
        description: 'Choose your house!'
    })
], HousePicker);
