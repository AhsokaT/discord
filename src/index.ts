import { ActivityType, GatewayIntentBits } from 'discord.js';
import { Client } from './client/client';
import './events/index';
import './commands/index';
import './handlers/index';

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