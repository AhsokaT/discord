"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const discord_js_1 = require("discord.js");
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
let UserInfo = class UserInfo extends framework_1.InteractionHandler {
    async run(interaction) {
        const [, userId] = interaction.customId.split('_');
        const user = await interaction.client.users.fetch(userId);
        const member = await interaction.guild?.members.fetch(userId).catch(() => void 0);
        const infoEmbed = new discord_js_1.EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL({ size: 4096 }))
            .addFields({ name: 'Username', value: user.tag });
        const nickname = member && member.nickname;
        const displayName = nickname ?? user.globalName;
        if (displayName)
            infoEmbed.addFields({ name: 'Display name', value: displayName });
        infoEmbed.addFields({ name: 'Snowflake ID', value: user.id });
        if (member) {
            if (member.roles.cache.size > 1) {
                const roles = member.roles.cache.filter(role => (typeof role === 'string' ? role : role.id) !== interaction.guildId).map(role => typeof role === 'string' ? `<@&${role}>` : String(role)).join(' ');
                if (roles.length <= 1024)
                    infoEmbed.addFields({ name: 'Roles', value: roles });
            }
            if (member.premiumSinceTimestamp)
                infoEmbed.addFields({ name: 'Boosting since', value: `<t:${Math.round(member.premiumSinceTimestamp / 1000)}:D> <t:${Math.round(member.premiumSinceTimestamp / 1000)}:R>` });
            if (member.isCommunicationDisabled())
                infoEmbed.addFields({ name: 'Communication disabled until', value: `<t:${Math.round(member.communicationDisabledUntilTimestamp / 1000)}:f> <t:${Math.round(member.communicationDisabledUntilTimestamp / 1000)}:R> :stopwatch:` });
            if (member.joinedTimestamp)
                infoEmbed.addFields({ name: 'Joined server', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:D> <t:${Math.round(member.joinedTimestamp / 1000)}:R>` });
        }
        infoEmbed.addFields({ name: 'Joined Discord', value: `<t:${Math.round(user.createdTimestamp / 1000)}:D> <t:${Math.round(user.createdTimestamp / 1000)}:R>` });
        interaction.reply({
            ephemeral: true,
            allowedMentions: { parse: [] },
            embeds: [infoEmbed]
        }).catch(console.warn);
    }
    parse(interaction) {
        return /^USERINFO/.test(interaction.customId) ? this.some() : this.none();
    }
};
exports.UserInfo = UserInfo;
exports.UserInfo = UserInfo = __decorate([
    (0, decorators_1.ApplyOptions)({
        interactionHandlerType: framework_1.InteractionHandlerTypes.Button
    })
], UserInfo);
framework_1.container.stores.loadPiece({
    piece: UserInfo,
    name: UserInfo.name,
    store: 'interaction-handlers'
});
