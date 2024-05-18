"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const misc_1 = require("./misc");
const client_1 = require("./Client/client");
const dotenv_1 = require("dotenv");
// Commands
require("./Commands/HousePicker");
require("./Commands/HousePoints");
require("./Commands/Leaderboard");
// Interaction Handlers
require("./interaction-handlers/Delete");
require("./interaction-handlers/HouseButtons");
require("./interaction-handlers/HousePicker");
require("./interaction-handlers/Leaderboard");
require("./interaction-handlers/ViewChanges");
(0, dotenv_1.config)();
const client = new client_1.Client({
    presence: {
        status: 'idle',
        activities: [
            {
                type: discord_js_1.ActivityType.Watching,
                name: 'Zuko looking for his honour'
            }
        ]
    },
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
    ],
    baseUserDirectory: null
});
client.on(discord_js_1.Events.ClientReady, ready => console.debug(`${ready.user.tag} is online!`));
client.on(discord_js_1.Events.ClientReady, async (ready) => {
    try {
        (0, misc_1.postHousePicker)(ready);
    }
    catch (err) {
        console.debug(`Unable to post house picker: ${err}`);
    }
});
client.on(discord_js_1.Events.GuildMemberAdd, async (member) => {
    if (member.guild.id !== '509135025560616963' || member.user.bot)
        return;
    const channel = await member.guild.channels.fetch('961986228926963732');
    const commands = await member.guild.commands.fetch();
    const command = commands.find(({ name }) => name === 'choosehouse');
    channel.send({ content: `Welcome to the server, ${member}! When you're ready, use ${command ? `</choosehouse:${command.id}>` : '`/choosehouse`'} to join a house and begin collecting points!` })
        .then(msg => setTimeout(() => msg.delete(), 10000));
});
client.login();
