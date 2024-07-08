import { Client } from './client/client.js';
import { GatewayIntentBits } from 'discord.js';

const client = new Client({
    presence: { status: 'online' },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.login();
