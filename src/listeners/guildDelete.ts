import { Listener, Events } from '@sapphire/framework';
import { Client } from '../client/client.js';
import { Guild } from 'discord.js';

export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
    run(guild: Guild) {
        (guild.client as Client).guildData.delete(guild.id);
    }
}