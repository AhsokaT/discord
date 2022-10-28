import { GatewayIntentBits } from 'discord.js';
import { Client } from './client';
import { config } from 'dotenv';

// Commands
import { BanCommand as OldBan } from './Commands/ban';
import { HOUSE_COMMAND } from './Commands/House/housePicker';
import { USER_INFO_COMMAND } from './Commands/New/userinfo';
import { UnbanCommand } from './Commands/unban';
import { postHousePicker } from './misc';
import { LEADERBOARD } from './Commands/House/leaderboard';
import { HOUSE_INFO } from './Commands/House/houseInfo';
import { guildMemberRemove } from './Events/guildMemberRemove';
import { HOUSE_POINTS } from './Commands/House/housePoints';

// dotenv
config();

const events = [guildMemberRemove];
const mongoURL = process.env.MONGO;

if (!mongoURL)
    throw new Error('process.env.MONGO is undefined');

const client = new Client({
    presence: { status: 'idle' },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites
    ],
    mongoURL
});

events.forEach(event => client.on(event.event, event.listener));

client.on('ready', ready => {
    console.debug(`${ready.user.tag} is online!`);
    // ready.guilds.fetch().then(guilds => guilds.forEach(guild => console.log(guild.name)));
});

client.once('ready', async () => {
    client.registerCommands(
        new OldBan(),
        new UnbanCommand()
    );

    client.addCommands(
        LEADERBOARD,
        USER_INFO_COMMAND,
        HOUSE_COMMAND,
        HOUSE_INFO,
        HOUSE_POINTS
    );

    postHousePicker(client)
        .catch(err => console.debug(`Unable to post house picker: ${err}`));

    // client.emit('guildMemberRemove', await (await client.guilds.fetch('509135025560616963')).members.fetch('509080069264769026'));
});

client.login(process.env.TOKEN);

process.on('unhandledRejection', console.error);