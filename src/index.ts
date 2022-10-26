import { ButtonBuilder, ButtonInteraction, GatewayIntentBits } from 'discord.js';
import { Client } from './client';
import { config } from 'dotenv';

// Commands
import { BanCommand as OldBan } from './Commands/ban';
import { ADJUST_POINTS_COMMAND } from './Commands/House/adjustpoints';
import { HOUSE_COMMAND } from './Commands/House/house';
import { USER_INFO_COMMAND } from './Commands/New/userinfo';
import { UnbanCommand } from './Commands/unban';
import { postHousePicker, updateHousePoints } from './misc';
import { LEADERBOARD } from './Commands/House/leaderboard';
import { HOUSE_INFO } from './Commands/House/houseInfo';
import { guildMemberRemove } from './Events/guildMemberRemove';

// dotenv
config();

const events = [guildMemberRemove];

const client = new Client({
    presence: { status: 'idle' },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites
    ]
});

events.forEach(event => client.on(event.event, event.listener));

client.on('ready', ready => console.debug(`${ready.user.tag} is online!`));

client.once('ready', async ready => ready.guilds.fetch().then(guilds => guilds.forEach(guild => console.log(guild.name))));

client.once('ready', async ready => {
    (ready as Client).registerCommands(
        new OldBan(),
        new UnbanCommand()
    );

    (ready as Client).addCommands(
        LEADERBOARD,
        USER_INFO_COMMAND,
        HOUSE_COMMAND,
        ADJUST_POINTS_COMMAND,
        HOUSE_INFO
    );

    postHousePicker(ready as Client<true>)
        .then(message => console.debug(`Posted house picker: ${message.id}`))
        .catch(err => console.debug(`Unable to post house picker: ${err}`));

    updateHousePoints(ready as Client, '1028280826472955975', '1028281169860628490').catch(console.debug);

    // client.emit('guildMemberRemove', await (await client.guilds.fetch('509135025560616963')).members.fetch('509080069264769026'));
});

client.housePointManager.on('update', () => updateHousePoints(client, '1028280826472955975', '1028281169860628490').catch(console.debug));

client.login(process.env.TOKEN);

process.on('unhandledRejection', console.error);