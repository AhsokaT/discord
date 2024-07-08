import { Listener, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';

export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
    run(guild: Guild) {
        guild.client.guildData.delete(guild.id);
    }
}
