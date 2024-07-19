import { Events, Listener } from '@sapphire/framework';
import { Client } from '../client/client.js';
import { ChannelId } from '../util/enum.js';
import assert from 'assert/strict';
import { EmbedBuilder } from 'discord.js';

export class Ready extends Listener<typeof Events.ClientReady> {
    async run(ready: Client<true>) {
        console.debug(`${ready.user.tag} is online!`);

        const channel = await ready.channels.fetch(ChannelId.Logs);

        assert.ok(channel?.isTextBased());

        const embed = new EmbedBuilder()
            .setAuthor;
    }
}
