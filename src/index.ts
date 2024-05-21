import { ActivityType, Events, GatewayIntentBits, TextChannel } from 'discord.js';
import { Client } from './Client/client';
import { config } from 'dotenv';

// Commands
import './Commands/HousePicker';
import './Commands/HousePoints';
import './Commands/Leaderboard';
import './Commands/Test';
import './Commands/Embed';

// Interaction Handlers
import './Handlers/Delete';
import './Handlers/HouseButtons';
import './Handlers/HousePicker';
import './Handlers/Leaderboard';
import './Handlers/ViewChanges';
import './Handlers/UserInfo';
import './Handlers/HouseInfo';

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
})
.on(Events.GuildMemberAdd, async member => {
    if (member.guild.id !== '509135025560616963' || member.user.bot)
        return;

    const channel = await member.guild.channels.fetch('961986228926963732') as TextChannel;
    const commands = await member.guild.commands.fetch();
    const command = commands.find(({ name }) => name === 'choosehouse');

    channel.send({ content: `Welcome to the server, ${member}! When you're ready, use ${command ? `</choosehouse:${command.id}>` : '`/choosehouse`'} to join a house and begin collecting points!` });
}).on(Events.ClientReady, ready => console.debug(`${ready.user.tag} is online!`));

client.login();