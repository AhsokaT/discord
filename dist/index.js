"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("./client");
const dotenv_1 = require("dotenv");
// Commands
const ban_1 = require("./Commands/ban");
const housePicker_1 = require("./Commands/House/housePicker");
const userinfo_1 = require("./Commands/New/userinfo");
const unban_1 = require("./Commands/unban");
const misc_1 = require("./misc");
const leaderboard_1 = require("./Commands/House/leaderboard");
const houseInfo_1 = require("./Commands/House/houseInfo");
const guildMemberRemove_1 = require("./Events/guildMemberRemove");
const housePoints_1 = require("./Commands/House/housePoints");
// dotenv
(0, dotenv_1.config)();
const events = [guildMemberRemove_1.guildMemberRemove];
const mongoURL = process.env.MONGO;
if (!mongoURL)
    throw new Error('process.env.MONGO is undefined');
const client = new client_1.Client({
    presence: { status: 'idle' },
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildBans,
        discord_js_1.GatewayIntentBits.GuildInvites
    ],
    mongoURL
});
events.forEach(event => client.on(event.event, event.listener));
client.on('ready', ready => {
    console.debug(`${ready.user.tag} is online!`);
    ready.guilds.fetch().then(guilds => guilds.forEach(guild => console.log(guild.name)));
});
client.once('ready', async () => {
    client.registerCommands(new ban_1.BanCommand(), new unban_1.UnbanCommand());
    client.addCommands(leaderboard_1.LEADERBOARD, userinfo_1.USER_INFO_COMMAND, housePicker_1.HOUSE_COMMAND, houseInfo_1.HOUSE_INFO, housePoints_1.HOUSE_POINTS);
    (0, misc_1.postHousePicker)(client)
        .catch(err => console.debug(`Unable to post house picker: ${err}`));
    // client.emit('guildMemberRemove', await (await client.guilds.fetch('509135025560616963')).members.fetch('509080069264769026'));
});
client.login(process.env.TOKEN);
process.on('unhandledRejection', console.error);
