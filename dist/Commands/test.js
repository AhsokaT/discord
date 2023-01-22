"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("./builders");
const housePicker_1 = require("./House/housePicker");
const template_1 = require("./template");
const SLASH = new discord_js_1.SlashCommandBuilder()
    .setName('test')
    .setDescription('test')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers);
exports.TEST = new template_1.Command()
    .addIdentifiers('test')
    .addBuilders(SLASH)
    .addGuilds('509135025560616963')
    .onChatInputCommand(i => i.reply({
    embeds: [
        (0, builders_1.allPointChangeEmbed)(Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {}), Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {})),
        (0, builders_1.pointChangeEmbed)(housePicker_1.RoleHouse[housePicker_1.RoleID.OWL], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))
    ],
    components: [
        new discord_js_1.ActionRowBuilder().addComponents((0, builders_1.pointChangeButton)(Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {}), Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {})), (0, builders_1.LeaderboardButton)())
    ],
    ephemeral: true
}).catch(console.debug));
