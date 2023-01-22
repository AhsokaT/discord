"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LMAO = void 0;
const discord_js_1 = require("discord.js");
const template_1 = require("./template");
exports.LMAO = new template_1.Command()
    .addBuilders(new discord_js_1.SlashCommandBuilder()
    .setName('nsfw')
    .setDescription('nsfw'))
    .onChatInputCommand(i => {
    i.reply({
        ephemeral: true,
        content: '20 pushups now\nhttps://tenor.com/view/stare-christian-bale-handsome-gif-13379950'
    });
});
