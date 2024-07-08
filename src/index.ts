import { ActivityType, GatewayIntentBits } from 'discord.js';
import { Client } from './client/client.js';
import './events/load.js';
import './commands/load.js';
import './handlers/load.js';
import url from 'url';
import path from 'path';

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

console.log(await import(url.pathToFileURL(path.join(process.cwd(), 'src', 'commands', 'Ping.js')).toString()));
