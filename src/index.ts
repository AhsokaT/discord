import { ActivityType, GatewayIntentBits } from 'discord.js';
import { Client } from './client/client.js';
import './events/load.js';
import './commands/load.js';
import './handlers/load.js';

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

console.log(await import('./commands/Ping.js'));
