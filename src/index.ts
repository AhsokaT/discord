import { ActivityType, GatewayIntentBits } from 'discord.js';
import { Client } from './Client/client';
import { config } from 'dotenv';
import './events/index';
import './Commands/index';
import './Handlers/index';

config();

const client = new Client({
    presence: {
        status: 'idle',
        activities: [
            {
                type: ActivityType.Watching,
                name: 'Zuko looking for his honour'
            }
        ]
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
    baseUserDirectory: null
});

client.login();