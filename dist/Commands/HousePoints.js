"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePointsCommand = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../Util/builders");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const enum_1 = require("../Util/enum");
let HousePointsCommand = class HousePointsCommand extends framework_1.Command {
    async chatInputRun(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const client = interaction.client;
        const current = Object.fromEntries([...client.database.cache]);
        const newTotals = {
            TIGER: interaction.options.getInteger('tigers') ?? current.TIGER,
            OWL: interaction.options.getInteger('owls') ?? current.OWL,
            RAVEN: interaction.options.getInteger('ravens') ?? current.RAVEN,
            TURTLE: interaction.options.getInteger('turtles') ?? current.TURTLE,
            PANDA: interaction.options.getInteger('pandas') ?? current.PANDA
        };
        let changes = Object.keys(newTotals)
            .filter(house => newTotals[house] !== current[house])
            .map(house => [house, newTotals[house]]);
        if (changes.length === 0)
            return void interaction.editReply('No changes were made');
        try {
            await client.database.patch(changes);
        }
        catch (err) {
            console.error(err);
        }
        Object.keys(newTotals)
            .filter(house => newTotals[house] !== current[house])
            .forEach(async (houseId) => {
            const changeButton = (0, builders_1.pointChangeButton)(current, newTotals);
            const actionRow = new discord_js_1.ActionRowBuilder();
            const house = enum_1.House[houseId];
            if (changeButton)
                actionRow.addComponents(changeButton, (0, builders_1.LeaderboardButton)());
            else
                actionRow.addComponents((0, builders_1.LeaderboardButton)());
            const channel = await client.channels.fetch(house.channelId);
            channel.send({
                embeds: [(0, builders_1.pointChangeEmbed)(houseId, current[houseId], newTotals[houseId])],
                components: [actionRow]
            })
                .catch(console.debug);
        });
        const changed = Object.keys(newTotals).some(house => newTotals[house] !== current[house]);
        interaction.editReply(changed ? 'Changes made' : 'No changes were made').catch(console.debug);
        if (!changed)
            return;
        try {
            const [logs, trophy] = await Promise.all([client.channels.fetch(enum_1.ChannelId.Logs), client.channels.fetch(enum_1.ChannelId.Trophy)]);
            const payload = {
                embeds: [(0, builders_1.allPointChangeEmbed)(current, newTotals)],
                allowedMentions: { parse: [] },
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.LeaderboardButton)())
                ]
            };
            logs.send(payload);
            trophy.send(payload);
        }
        catch (err) {
            console.error(err);
        }
    }
    registerApplicationCommands(registry) {
        const builder = new discord_js_1.SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild);
        for (const house of enum_1.House.ALL)
            builder.addIntegerOption(option => option
                .setName(house.id.toLowerCase().replace(/(\b\w+\b)/g, '$1s'))
                .setDescription(`New total for ${house.name}`));
        registry.registerChatInputCommand(builder, { guildIds: ['509135025560616963'] });
    }
};
exports.HousePointsCommand = HousePointsCommand;
exports.HousePointsCommand = HousePointsCommand = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: 'housepoints',
        description: 'Add or remove points from houses'
    })
], HousePointsCommand);
framework_1.container.stores.loadPiece({
    piece: HousePointsCommand,
    name: HousePointsCommand.name,
    store: 'commands'
});
