import { GatewayIntentBits } from 'discord.js';
import { Client } from './client';
import { config } from 'dotenv';

// Commands
import { BanCommand as OldBan } from './Commands/ban';
import { ASSIGN_POINTS_COMMAND, REMOVE_POINTS_COMMAND } from './Commands/House/houseCommands';
import { HOUSE_COMMAND } from './Commands/House/house';
import { USER_INFO_COMMAND } from './Commands/New/userinfo';
import { UnbanCommand } from './Commands/unban';
import { postHousePicker, updateHousePoints } from './misc';

// dotenv
config();

const client = new Client({
    presence: { status: 'idle' },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans
    ]
});

client.on('ready', ready => console.debug(`${ready.user.tag} is online!`));

client.once('ready', async ready => ready.guilds.fetch().then(guilds => guilds.forEach(guild => console.log(guild.name))));

client.once('ready', async ready => {
    (ready as Client).registerCommands(
        new OldBan(),
        new UnbanCommand()
    );

    (ready as Client).addCommands(
        USER_INFO_COMMAND,
        HOUSE_COMMAND,
        ASSIGN_POINTS_COMMAND,
        REMOVE_POINTS_COMMAND
    );

    postHousePicker(ready as Client<true>)
        .then(message => console.debug(`Posted house picker: ${message.id}`))
        .catch(err => console.debug(`Unable to post house picker: ${err}`));

    updateHousePoints(ready as Client, '1017094377690108046', '1027995705438126151', client.housePointManager.points).catch(console.debug);

    client.housePointManager.on('update', points => updateHousePoints(ready as Client, '1017094377690108046', '1027995705438126151', points).catch(console.debug));
});

client.login(process.env.TOKEN);

process.on('unhandledRejection', console.error);