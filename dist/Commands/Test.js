"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const decorators_1 = require("@sapphire/decorators");
const framework_1 = require("@sapphire/framework");
const builders_1 = require("../util/builders");
const discord_js_1 = require("discord.js");
let Test = class Test extends framework_1.Command {
    chatInputRun(interaction) {
        interaction.reply({
            embeds: [
                (0, builders_1.allPointChangeEmbed)({ TIGER: 0, OWL: 0, RAVEN: 0, TURTLE: 0, PANDA: 0 }, { TIGER: 1, OWL: 2, RAVEN: 3, TURTLE: 4, PANDA: 5 }, interaction.user),
                (0, builders_1.pointChangeEmbed)('TIGER', 0, 1, interaction.user)
            ],
            allowedMentions: { parse: [] }
        }).catch(console.error);
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => builder
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild), { guildIds: ['509135025560616963'] });
    }
};
exports.Test = Test;
exports.Test = Test = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: 'test',
        description: 'Test'
    })
], Test);
framework_1.container.stores.loadPiece({
    piece: Test,
    name: Test.name,
    store: 'commands'
});
