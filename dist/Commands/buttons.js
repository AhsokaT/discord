"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeBanButton = void 0;
const discord_js_1 = require("discord.js");
function revokeBanButton(banned) {
    return new discord_js_1.ButtonBuilder()
        .setCustomId(`UNBAN_${banned.id}`)
        .setLabel('Revoke ban')
        .setStyle(discord_js_1.ButtonStyle.Primary);
}
exports.revokeBanButton = revokeBanButton;
