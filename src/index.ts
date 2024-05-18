import { ActivityType, Events, GatewayIntentBits, TextChannel } from 'discord.js';
import { postHousePicker } from './misc';
import { Client } from './Client/client';
import { config } from 'dotenv';

// Commands
import './Commands/HousePicker';
import './Commands/HousePoints';
import './Commands/Leaderboard';

// Interaction Handlers
import './interaction-handlers/Delete';
import './interaction-handlers/HouseButtons';
import './interaction-handlers/HousePicker';
import './interaction-handlers/Leaderboard';
import './interaction-handlers/ViewChanges';

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

client.on(Events.ClientReady, ready => console.debug(`${ready.user.tag} is online!`));

client.on(Events.ClientReady, async (ready: Client<true>) => {
    try {
        postHousePicker(ready);
    } catch (err) {
        console.debug(`Unable to post house picker: ${err}`);
    }
});

client.on(Events.GuildMemberAdd, async member => {
    if (member.guild.id !== '509135025560616963' || member.user.bot)
        return;

    const channel = await member.guild.channels.fetch('961986228926963732') as TextChannel;
    const commands = await member.guild.commands.fetch();
    const command = commands.find(({ name }) => name === 'choosehouse');

    channel.send({ content: `Welcome to the server, ${member}! When you're ready, use ${command ? `</choosehouse:${command.id}>` : '`/choosehouse`'} to join a house and begin collecting points!` })
        .then(msg => setTimeout(() => msg.delete(), 10000));
});

client.login();