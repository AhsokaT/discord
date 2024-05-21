"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const discord_js_1 = require("discord.js");
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const builders_1 = require("../Util/builders");
let Leaderboard = class Leaderboard extends framework_1.Command {
    chatInputRun(interaction) {
        interaction.reply({
            embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client)],
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents((0, builders_1.UpdateLeaderboardButton)(), (0, builders_1.DeleteInteractionButton)())
            ],
            allowedMentions: { parse: [] }
        }).catch(console.error);
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand({ name: this.name, description: this.description }, { guildIds: ['509135025560616963'] });
    }
};
exports.Leaderboard = Leaderboard;
exports.Leaderboard = Leaderboard = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: 'leaderboard',
        description: 'See who\'s ahead in the house competitions'
    })
], Leaderboard);
framework_1.container.stores.loadPiece({
    piece: Leaderboard,
    name: Leaderboard.name,
    store: 'commands'
});
