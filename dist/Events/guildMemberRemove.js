"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildMemberRemove = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../Commands/builders");
const ClientEvent_1 = require("./ClientEvent");
exports.guildMemberRemove = new ClientEvent_1.ClientEvent('guildMemberRemove', async (member) => {
    const ban = await member.guild.bans.fetch(member).catch(() => null);
    if (ban)
        return;
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Member left')
        .setAuthor({ name: member.user.tag })
        .addFields({ name: 'Member', value: member.toString(), inline: true }, { name: 'Left', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true });
    if (member.joinedTimestamp)
        embed.addFields({ name: 'Joined', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:R>`, inline: true });
    member.client.sendToLogChannel({
        embeds: [embed],
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(member.user.id))
        ],
        allowedMentions: { parse: [] }
    })
        .catch(console.debug);
});
