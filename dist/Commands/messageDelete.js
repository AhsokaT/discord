"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_DELETE = void 0;
const template_1 = require("./template");
exports.MESSAGE_DELETE = new template_1.Command()
    .addIdentifiers('MESSAGEDELETE')
    .onButton(async (interaction) => {
    const [_, channelID, messageID] = interaction.customId.split('_');
    interaction.guild.channels.fetch(channelID)
        .then(channel => channel.messages.fetch(messageID))
        .then(message => message.delete())
        .then(() => interaction.update({ content: 'Message deleted', components: [] }))
        .catch(() => interaction.update('Failed to delete message :('));
});
