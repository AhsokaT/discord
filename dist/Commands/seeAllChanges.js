"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POINT_CHANGE = void 0;
const builders_1 = require("@discordjs/builders");
const builders_2 = require("./builders");
const template_1 = require("./template");
exports.POINT_CHANGE = new template_1.Command()
    .addIdentifiers('P')
    .addGuilds('509135025560616963')
    .onButton(interaction => {
    let [_, json] = interaction.customId.split('_');
    const changes = JSON.parse(json);
    const before = Object.keys(changes).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][0] }), {});
    const after = Object.keys(changes).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][1] }), {});
    interaction.reply({
        embeds: [
            (0, builders_2.allPointChangeEmbed)(before, after)
        ],
        components: [
            new builders_1.ActionRowBuilder().addComponents((0, builders_2.DeleteInteractionButton)())
        ],
        allowedMentions: { parse: [] }
    }).catch(console.debug);
});
