import { ActivitiesOptions, ActivityType, GatewayIntentBits, GuildTextBasedChannel } from 'discord.js';
import { Client } from './client';
import { config } from 'dotenv';

// Commands
import { HOUSE_COMMAND } from './Commands/House/housePicker';
import { postHousePicker } from './misc';
import { LEADERBOARD, UPDATE_LEADERBOARD } from './Commands/House/leaderboard';
import { HOUSE_INFO } from './Commands/House/houseInfo';
import { guildMemberRemove } from './Events/guildMemberRemove';
import { HOUSE_POINTS } from './Commands/House/housePoints';
import { guildMemberAdd } from './Events/guildMemberAdd';
import { guildBanAdd } from './Events/guildBanAdd';
import { guildBanRemove } from './Events/guildBanRemove';
import { MESSAGE_DELETE } from './Commands/messageDelete';
import { POINT_CHANGE } from './Commands/seeAllChanges';
import { DELETE_INTERACTION } from './Commands/DeleteInteraction';
import { HOUSES } from './Commands/House/choosehouse';

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
        GatewayIntentBits.GuildModeration,
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

client.once('ready', async ready => {
    (ready as Client<true>).addCommands(
        LEADERBOARD,
        HOUSE_COMMAND,
        HOUSE_INFO,
        HOUSE_POINTS,
        UPDATE_LEADERBOARD,
        MESSAGE_DELETE,
        POINT_CHANGE,
        DELETE_INTERACTION,
        HOUSES
    );

    try {
        postHousePicker(ready as Client<true>);
    } catch (err) {
        console.debug(`Unable to post house picker: ${err}`);
    }
});

client.on('guildMemberAdd', async member => {
    if (member.guild.id !== '509135025560616963')
        return;

    const channel = await member.guild.channels.fetch('961986228926963732') as GuildTextBasedChannel;

    channel.send({ content: `Welcome to the server, ${member}! When you're ready, use </choosehouse:${client.choosehouseId}> to join a house and begin collecting points!` });
});

client.login(process.env.TOKEN);

process.on('unhandledRejection', console.error);