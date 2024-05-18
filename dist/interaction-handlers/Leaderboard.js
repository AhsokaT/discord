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
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const builders_1 = require("../Util/builders");
let Leaderboard = class Leaderboard extends framework_1.InteractionHandler {
    run(interaction) {
        if (interaction.customId === 'LEADERBOARD')
            return void interaction.reply({
                embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client)],
                components: [
                    new discord_js_1.ActionRowBuilder()
                        .addComponents((0, builders_1.UpdateLeaderboardButton)(), (0, builders_1.DeleteInteractionButton)())
                ],
                allowedMentions: { parse: [] }
            }).catch(console.error);
        interaction.update({ embeds: [(0, builders_1.LeaderboardEmbed)(interaction.client)] }).catch(console.debug);
    }
    parse(interaction) {
        return /LEADERBOARD|UPDATELEADERBOARD/.test(interaction.customId) ? this.some() : this.none();
    }
};
exports.Leaderboard = Leaderboard;
exports.Leaderboard = Leaderboard = __decorate([
    (0, decorators_1.ApplyOptions)({
        interactionHandlerType: framework_1.InteractionHandlerTypes.Button
    })
], Leaderboard);
