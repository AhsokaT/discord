"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHousePicker = void 0;
const discord_js_1 = require("discord.js");
const housePicker_1 = require("./Commands/House/housePicker");
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
                    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel(housePicker_1.House.TIGER)
                    .setValue('TIGER')
                    .setEmoji({ name: housePicker_1.HouseEmoji.TIGER })
                    .setDescription(housePicker_1.HouseDescription.TIGER), new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel(housePicker_1.House.OWL)
                    .setValue('OWL')
                    .setEmoji({ name: housePicker_1.HouseEmoji.OWL })
                    .setDescription(housePicker_1.HouseDescription.OWL), new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel(housePicker_1.House.RAVEN)
                    .setValue('RAVEN')
                    .setEmoji({ name: housePicker_1.HouseEmoji.RAVEN })
                    .setDescription(housePicker_1.HouseDescription.RAVEN), new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel(housePicker_1.House.TURTLE)
                    .setValue('TURTLE')
                    .setEmoji({ name: housePicker_1.HouseEmoji.TURTLE })
                    .setDescription(housePicker_1.HouseDescription.TURTLE), new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel(housePicker_1.House.PANDA)
                    .setValue('PANDA')
                    .setEmoji({ name: housePicker_1.HouseEmoji.PANDA })
                    .setDescription(housePicker_1.HouseDescription.PANDA)))
            ]
        };
        if (message)
            message.edit(payload).then(res).catch(rej);
        else
            channel.send(payload).then(res).catch(rej);
    });
}
exports.postHousePicker = postHousePicker;
