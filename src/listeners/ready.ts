import { Events, Listener } from '@sapphire/framework';
import assert from 'assert/strict';
import { ChannelType, EmbedBuilder } from 'discord.js';
import { Client } from '../client/client.js';
import { ChannelId } from '../util/enum.js';

export class Ready extends Listener<typeof Events.ClientReady> {
    async run(ready: Client<true>) {
        console.debug(`${ready.user.tag} is online!`);

        // const isProduction =
        //     '_' in process && String(process._).includes('heroku');

        // if (!isProduction) return;

        const logs = await ready.channels.fetch(ChannelId.Logs);

        assert(logs?.type === ChannelType.GuildText);
        logs.send(`process.env._: ${process.env._}`);

        if (5 + 5 === 10) return;

        const readySince = ~~(ready.readyTimestamp / 1000);
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle('Client ready')
            .setDescription(
                `> ${
                    ready.irohQuotes[
                        ~~(Math.random() * ready.irohQuotes.length)
                    ]
                }\n— Uncle Iroh`
            )
            .addFields(
                {
                    name: 'Ready since',
                    value: `<t:${~~readySince}:f> <t:${~~readySince}:R>`,
                    inline: true,
                },
                {
                    name: 'Memory usage',
                    value: `${memoryUsage.toFixed(2)}MB`,
                    inline: true,
                },
                {
                    name: 'Node.js',
                    value: process.version,
                    inline: true,
                }
            )
            .setAuthor({
                name: ready.user.username,
                iconURL: ready.user.displayAvatarURL(),
            });

        await logs.send({ embeds: [embed] });
    }
}
