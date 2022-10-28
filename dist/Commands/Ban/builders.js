"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBanEmbed = exports.buildBanRevokeButton = exports.buildReasonModal = void 0;
const discord_js_1 = require("discord.js");
const buildReasonModal = (member) => new discord_js_1.ModalBuilder()
    .setTitle('Ban')
    .setCustomId(`BAN_${member.id}`)
    .addComponents(new discord_js_1.ActionRowBuilder()
    .addComponents(new discord_js_1.TextInputBuilder()
    .setCustomId('REASON')
    .setPlaceholder(`Reason for ban`)
    .setLabel(`Reason for banning ${member.user.tag}`)
    .setMaxLength(512)
    .setStyle(discord_js_1.TextInputStyle.Paragraph)
    .setRequired(false)));
exports.buildReasonModal = buildReasonModal;
const buildBanRevokeButton = (banned) => new discord_js_1.ButtonBuilder()
    .setCustomId(`UNBAN_${banned.id}`)
    .setLabel('Revoke ban')
    .setStyle(discord_js_1.ButtonStyle.Primary);
exports.buildBanRevokeButton = buildBanRevokeButton;
const buildBanEmbed = (banned, moderator) => new discord_js_1.EmbedBuilder()
    .setColor('#2F3136')
    .setFooter({ text: `Banned user ID ${banned.user.id}\nModerator ID ${moderator.id}` })
    .setDescription(`**${banned.user.tag}** was **snapped** out of existence by ${moderator}`)
    .setImage('https://media.giphy.com/media/LOoaJ2lbqmduxOaZpS/giphy.gif?cid=ecf05e47gzp0mc04nqhf3ejthzmnd7vv3db10bzdq941ucfm&rid=giphy.gif&ct=g');
exports.buildBanEmbed = buildBanEmbed;
