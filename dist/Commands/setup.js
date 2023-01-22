"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETUP = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("./template");
exports.SETUP = new template_1.Command()
    .addIdentifiers('SETUP')
    .onButton(interaction => {
    interaction.reply({
        components: [
            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.RoleSelectMenuBuilder()
                .setCustomId('.')
                .setPlaceholder('Which Avenger are you?'))
        ],
        ephemeral: true
    });
});
