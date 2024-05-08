"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("./client");
const dotenv_1 = require("dotenv");
// Commands
const housePicker_1 = require("./Commands/House/housePicker");
const misc_1 = require("./misc");
const leaderboard_1 = require("./Commands/House/leaderboard");
const houseInfo_1 = require("./Commands/House/houseInfo");
const guildMemberRemove_1 = require("./Events/guildMemberRemove");
const housePoints_1 = require("./Commands/House/housePoints");
const guildMemberAdd_1 = require("./Events/guildMemberAdd");
const guildBanAdd_1 = require("./Events/guildBanAdd");
const guildBanRemove_1 = require("./Events/guildBanRemove");
const messageDelete_1 = require("./Commands/messageDelete");
const seeAllChanges_1 = require("./Commands/seeAllChanges");
const DeleteInteraction_1 = require("./Commands/DeleteInteraction");
const choosehouse_1 = require("./Commands/House/choosehouse");
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
        discord_js_1.GatewayIntentBits.GuildModeration,
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
        setTimeout(setActivity, [60_000 * 5, 60_000 * 7, 60_000 * 10][~~(Math.random() * 3)]);
    }
    setActivity();
});
client.once('ready', async (ready) => {
    ready.addCommands(leaderboard_1.LEADERBOARD, housePicker_1.HOUSE_COMMAND, houseInfo_1.HOUSE_INFO, housePoints_1.HOUSE_POINTS, leaderboard_1.UPDATE_LEADERBOARD, messageDelete_1.MESSAGE_DELETE, seeAllChanges_1.POINT_CHANGE, DeleteInteraction_1.DELETE_INTERACTION, choosehouse_1.HOUSES);
    try {
        (0, misc_1.postHousePicker)(ready);
    }
    catch (err) {
        console.debug(`Unable to post house picker: ${err}`);
    }
});
client.on('guildMemberAdd', async (member) => {
    if (member.guild.id !== '509135025560616963')
        return;
    const channel = await member.guild.channels.fetch('961986228926963732');
    channel.send({ content: `Welcome to the server, ${member}! When you're ready, use </choosehouse:${client.choosehouseId}> to join a house and begin collecting points!` });
});
client.login(process.env.TOKEN);
process.on('unhandledRejection', console.error);
