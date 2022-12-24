"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildBanRemove = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../Commands/builders");
const ClientEvent_1 = require("./ClientEvent");
exports.guildBanRemove = new ClientEvent_1.ClientEvent('guildBanRemove', ban => {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Ban remove')
        .setAuthor({ name: ban.user.tag })
        .addFields({ name: 'User', value: ban.user.toString(), inline: true }, { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true });
    if (ban.reason)
        embed.addFields({ name: 'Reason', value: ban.reason, inline: true });
    ban.client.sendToLogChannel({
        embeds: [embed],
        components: [
            new discord_js_1.ActionRowBuilder()
                .addComponents((0, builders_1.UserInfoButton)(ban.user.id), (0, builders_1.BanButton)(ban.user.id)),
        ],
        allowedMentions: { parse: [] }
    })
        .catch(console.debug);
});
