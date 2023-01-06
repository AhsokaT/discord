"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildMemberAdd = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("../Commands/builders");
const ClientEvent_1 = require("./ClientEvent");
exports.guildMemberAdd = new ClientEvent_1.ClientEvent('guildMemberAdd', member => {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Member joined')
        .setAuthor({ name: member.user.tag })
        .addFields({ name: 'Member', value: member.toString(), inline: true }, { name: 'Joined', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true });
    member.client.sendToLogChannel({
        embeds: [embed],
        components: [
            new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.UserInfoButton)(member.user.id))
        ],
        allowedMentions: { parse: [] }
    })
        .catch(console.debug);
});
