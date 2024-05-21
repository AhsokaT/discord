"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
let Embed = class Embed extends framework_1.Command {
    chatInputRun(interaction) {
        const embed = new discord_js_1.EmbedBuilder();
        if (interaction.options.getString('title'))
            embed.setTitle(interaction.options.getString('title'));
        if (interaction.options.getString('description'))
            embed.setDescription(interaction.options.getString('description'));
        if (interaction.options.getInteger('colour'))
            embed.setColor(interaction.options.getInteger('colour'));
        if (interaction.options.getBoolean('author'))
            embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
        interaction.reply({
            embeds: [embed],
            allowedMentions: { parse: [] },
            ephemeral: true
        }).catch(console.error);
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => builder
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild)
            .addStringOption(option => option
            .setName('title')
            .setDescription('Embed title'))
            .addStringOption(option => option
            .setName('description')
            .setDescription('Embed description'))
            .addIntegerOption(option => option
            .setName('colour')
            .setDescription('Embed colour')
            .addChoices(Object.entries(discord_js_1.Colors).map(([name, value]) => ({ name, value })).slice(0, 25)))
            .addBooleanOption(option => option
            .setName('author')
            .setDescription('Display the author of the embed')), { guildIds: ['509135025560616963'] });
    }
};
exports.Embed = Embed;
exports.Embed = Embed = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: 'embed',
        description: 'Test'
    })
], Embed);
framework_1.container.stores.loadPiece({
    piece: Embed,
    name: Embed.name,
    store: 'commands'
});
