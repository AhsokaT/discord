"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("./client");
const dotenv_1 = require("dotenv");
// Commands
const ban_1 = require("./Commands/ban");
const adjustpoints_1 = require("./Commands/House/adjustpoints");
const house_1 = require("./Commands/House/house");
const userinfo_1 = require("./Commands/New/userinfo");
const unban_1 = require("./Commands/unban");
const misc_1 = require("./misc");
const leaderboard_1 = require("./Commands/House/leaderboard");
const houseInfo_1 = require("./Commands/House/houseInfo");
// dotenv
(0, dotenv_1.config)();
const client = new client_1.Client({
    presence: { status: 'idle' },
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildBans
    ]
});
client.on('ready', ready => console.debug(`${ready.user.tag} is online!`));
client.once('ready', async (ready) => ready.guilds.fetch().then(guilds => guilds.forEach(guild => console.log(guild.name))));
client.once('ready', async (ready) => {
    ready.registerCommands(new ban_1.BanCommand(), new unban_1.UnbanCommand());
    ready.addCommands(leaderboard_1.LEADERBOARD, userinfo_1.USER_INFO_COMMAND, house_1.HOUSE_COMMAND, adjustpoints_1.ADJUST_POINTS_COMMAND, houseInfo_1.HOUSE_INFO);
    (0, misc_1.postHousePicker)(ready)
        .then(message => console.debug(`Posted house picker: ${message.id}`))
        .catch(err => console.debug(`Unable to post house picker: ${err}`));
    (0, misc_1.updateHousePoints)(ready, '1028280826472955975', '1028281169860628490', ready.housePointManager.points).catch(console.debug);
});
client.housePointManager.on('update', points => (0, misc_1.updateHousePoints)(client, '1028280826472955975', '1028281169860628490', points).catch(console.debug));
client.login(process.env.TOKEN);
process.on('unhandledRejection', console.error);
