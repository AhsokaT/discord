"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("./Client/client");
const dotenv_1 = require("dotenv");
require("./events/index");
require("./Commands/index");
require("./Handlers/index");
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
client.login();
