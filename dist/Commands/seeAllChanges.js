"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POINT_CHANGE = void 0;
const builders_1 = require("./builders");
const housePicker_1 = require("./House/housePicker");
const template_1 = require("./template");
exports.POINT_CHANGE = new template_1.Command()
    .addIdentifiers('P')
    .addGuilds('509135025560616963')
    .onButton(interaction => {
    let [_, json] = interaction.customId.split('_');
    const changes = JSON.parse(json);
    const before = Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][0] }), {});
    const after = Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][1] }), {});
    interaction.reply({
        ephemeral: true,
        embeds: [
            (0, builders_1.allPointChangeEmbed)(before, after)
        ],
        allowedMentions: { parse: [] }
    }).catch(console.debug);
});
