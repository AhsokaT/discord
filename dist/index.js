"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("./client");
const dotenv_1 = require("dotenv");
// Commands
const ban_1 = require("./Commands/ban");
const houseCommands_1 = require("./Commands/House/houseCommands");
const house_1 = require("./Commands/House/house");
const userinfo_1 = require("./Commands/New/userinfo");
const unban_1 = require("./Commands/unban");
const misc_1 = require("./misc");
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
    ready.addCommands(userinfo_1.USER_INFO_COMMAND, house_1.HOUSE_COMMAND, houseCommands_1.ASSIGN_POINTS_COMMAND, houseCommands_1.REMOVE_POINTS_COMMAND);
    (0, misc_1.postHousePicker)(ready)
        .then(message => console.debug(`Posted house picker: ${message.id}`))
        .catch(err => console.debug(`Unable to post house picker: ${err}`));
    (0, misc_1.updateHousePoints)(ready, '1017094377690108046', '1027995705438126151', client.housePointManager.points).catch(console.debug);
    client.housePointManager.on('update', points => (0, misc_1.updateHousePoints)(ready, '1017094377690108046', '1027995705438126151', points).catch(console.debug));
});
client.login(process.env.TOKEN);
process.on('unhandledRejection', console.error);
