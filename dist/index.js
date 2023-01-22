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
const renameHouse_1 = require("./Commands/House/renameHouse");
const guildMemberAdd_1 = require("./Events/guildMemberAdd");
const guildBanAdd_1 = require("./Events/guildBanAdd");
const guildBanRemove_1 = require("./Events/guildBanRemove");
const play_1 = require("./Commands/play");
const message_1 = require("./Commands/message");
const messageDelete_1 = require("./Commands/messageDelete");
const test_1 = require("./Commands/test");
const seeAllChanges_1 = require("./Commands/seeAllChanges");
const housePoints_2 = require("./housePoints");
// dotenv
(0, dotenv_1.config)();
const events = [
    guildMemberRemove_1.guildMemberRemove,
    guildMemberAdd_1.guildMemberAdd,
    guildBanAdd_1.guildBanAdd,
    guildBanRemove_1.guildBanRemove
];
const mongoURL = process.env.MONGO;
if (!mongoURL)
    throw new Error('process.env.MONGO is undefined');
const activities = [
    'The Clone Wars',
    'The Mandalorian',
    'Wednesday',
    'Breaking Bad',
    'Better Call Saul',
    'Endgame',
    'Iron Man',
    'Captain America',
    'Thor',
].map(name => ({ type: discord_js_1.ActivityType.Watching, name }));
const client = new client_1.Client({
    presence: {
        status: 'idle',
        activities
    },
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildBans,
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildVoiceStates
    ],
    mongoURL
});
events.forEach(event => client.on(event.event, event.listener));
client.on('ready', ready => {
    console.debug(`${ready.user.tag} is online!`);
    let index = 0;
    function setActivity() {
        ready.user.setActivity(activities[index++]);
        if (index === activities.length)
            index = 0;
        setTimeout(setActivity, [60_000 * 5, 60_000 * 7, 60_000 * 10][Math.floor(Math.random() * 3)]);
    }
    setActivity();
});
client.once('ready', async () => {
    client.registerCommands(new ban_1.BanCommand(), new unban_1.UnbanCommand());
    client.addCommands(leaderboard_1.LEADERBOARD, userinfo_1.USER_INFO_COMMAND, housePicker_1.HOUSE_COMMAND, houseInfo_1.HOUSE_INFO, housePoints_1.HOUSE_POINTS, leaderboard_1.UPDATE_LEADERBOARD, renameHouse_1.RENAME_HOUSE, play_1.PLAY, message_1.MESSAGE, messageDelete_1.MESSAGE_DELETE, test_1.TEST, seeAllChanges_1.POINT_CHANGE);
    (0, misc_1.postHousePicker)(client)
        .catch(err => console.debug(`Unable to post house picker: ${err}`));
});
client.login(process.env.TOKEN);
process.on('unhandledRejection', console.error);
const x = housePoints_2.HousePoints.sample();
const y = housePoints_2.HousePoints.sample();
console.debug(x);
console.debug(y);
console.debug(x.difference(y));
console.debug(y.toJSON());
console.debug(x.equals(y));
