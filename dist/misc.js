"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHousePicker = void 0;
const discord_js_1 = require("discord.js");
const enum_1 = require("./Util/enum");
async function postHousePicker(client) {
    return new Promise(async (res, rej) => {
        const channel = await client.channels.fetch('961986228926963732')
            .catch(console.debug);
        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');
        const message = await channel.messages.fetch('1025526259259822140')
            .catch(console.debug);
        const payload = {
            content: '**Choose your house below**',
            allowedMentions: { parse: [] },
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId('HOUSE')
                    .setPlaceholder('Choose your house!')
                    .addOptions(enum_1.House.ALL.map(house => new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel(house.name)
                    .setEmoji(house.emoji)
                    .setDescription(house.description)
                    .setValue(house.id))))
            ]
        };
        if (message)
            message.edit(payload).then(res).catch(rej);
        else
            channel.send(payload).then(res).catch(rej);
    });
}
exports.postHousePicker = postHousePicker;
