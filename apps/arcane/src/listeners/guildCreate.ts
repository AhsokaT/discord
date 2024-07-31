import { Listener, Events } from '@sapphire/framework';
import { Guild } from 'discord.js';
import { Database } from '../managers/Database.js';

export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
    async run(guild: Guild) {
        await using db = await Database.connect(guild.client);

        await db.createGuildDocument(guild.id);
    }
}
