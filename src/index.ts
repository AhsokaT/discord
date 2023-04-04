import { ActivitiesOptions, ActivityType, GatewayIntentBits } from 'discord.js';
import { Client } from './client';
import { config } from 'dotenv';

// Commands
import { BanCommand as OldBan } from './Commands/ban';
import { HOUSE_COMMAND } from './Commands/House/housePicker';
import { USER_INFO_COMMAND } from './Commands/New/userinfo';
import { UnbanCommand } from './Commands/unban';
import { postHousePicker } from './misc';
import { LEADERBOARD, UPDATE_LEADERBOARD } from './Commands/House/leaderboard';
import { HOUSE_INFO } from './Commands/House/houseInfo';
import { guildMemberRemove } from './Events/guildMemberRemove';
import { HOUSE_POINTS } from './Commands/House/housePoints';
import { RENAME_HOUSE } from './Commands/House/renameHouse';
import { guildMemberAdd } from './Events/guildMemberAdd';
import { guildBanAdd } from './Events/guildBanAdd';
import { guildBanRemove } from './Events/guildBanRemove';
import { PLAY } from './Commands/play';
import { MESSAGE } from './Commands/send';
import { MESSAGE_DELETE } from './Commands/messageDelete';
import { TEST } from './Commands/test';
import { POINT_CHANGE } from './Commands/seeAllChanges';
import { HousePoints } from './housePoints';
import { DELETE_INTERACTION } from './Commands/DeleteInteraction';

// dotenv
config();

const events = [
    guildMemberRemove,
    guildMemberAdd,
    guildBanAdd,
    guildBanRemove
];

const mongoURL = process.env.MONGO;

if (!mongoURL)
    throw new Error('process.env.MONGO is undefined');

const activities: ActivitiesOptions[] = [
    'The Clone Wars',
    'The Mandalorian',
    'Wednesday',
    'Breaking Bad',
    'Better Call Saul',
    'Endgame',
    'Iron Man',
    'Captain America',
    'Thor',
].map(name => ({ type: ActivityType.Watching, name }));

const client = new Client({
    presence: {
        status: 'idle',
        activities
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates
    ],
    mongoURL
});

events.forEach(event => client.on(event.event, event.listener));

client.on('ready', ready => {
    console.debug(`${ready.user.tag} is online!`);

    let index = 0;

    function setActivity() {
        ready.user.setActivity(activities[index++]);

        if (index === activities.length)
            index = 0;

        setTimeout(setActivity, [60_000 * 5, 60_000 * 7, 60_000 * 10][~~(Math.random() * 3)]);
    }

    setActivity();
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
        HOUSE_POINTS,
        UPDATE_LEADERBOARD,
        RENAME_HOUSE,
        PLAY,
        MESSAGE,
        MESSAGE_DELETE,
        // TEST,
        POINT_CHANGE,
        DELETE_INTERACTION
    );

    postHousePicker(client)
        .catch(err => console.debug(`Unable to post house picker: ${err}`));

    client.emit('guildMemberAdd', await (await client.fetchDO()).members.fetch('451448994128723978'));
});

client.login(process.env.TOKEN);

process.on('unhandledRejection', console.error);

const x = HousePoints.sample();
const y = HousePoints.sample();

console.debug(x);
console.debug(y);
console.debug(x.difference(y));
console.debug(y.toJSON());
console.debug(x.equals(y));