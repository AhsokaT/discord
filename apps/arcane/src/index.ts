import { GatewayIntentBits } from 'discord.js';
import { Client } from './client/client.js';

const client = new Client({
    presence: { status: 'online' },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.login();
