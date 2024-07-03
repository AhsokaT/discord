import { Listener, Events } from '@sapphire/framework';
import { Client } from '../client/client.js';
import { Guild } from 'discord.js';

export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
    run(guild: Guild) {
        (guild.client as Client).guildData.create(guild.id);
    }
}