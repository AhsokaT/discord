import { Listener, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';

export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
    run(guild: Guild) {
        guild.client.guildData.create(guild.id);
    }
}