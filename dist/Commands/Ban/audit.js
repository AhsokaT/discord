"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("./builders");
function audit(banned, moderator, reason) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Member ban')
        .setAuthor({ name: moderator.user.tag })
        .setColor('#2F3136')
        .addFields({ name: 'Moderator', value: moderator.toString(), inline: true }, { name: 'Banned user', value: banned.user.tag, inline: true }, { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true })
        .setFooter({ text: `Banned user ID ${banned.id}\nModerator ID ${moderator.id}` });
    if (reason)
        embed.addFields({ name: 'Reason', value: reason });
    return moderator.client.sendToLogChannel({
        components: [
            new discord_js_1.ActionRowBuilder()
                .addComponents((0, builders_1.buildBanRevokeButton)(banned))
                .addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId(`USERINFO_${moderator.id}`)
                .setLabel('Moderator')
                .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                .setCustomId(`USERINFO_${banned.id}`)
                .setLabel('Banned user')
                .setStyle(discord_js_1.ButtonStyle.Secondary))
        ],
        embeds: [embed],
        allowedMentions: { parse: [] }
    });
}
exports.audit = audit;
