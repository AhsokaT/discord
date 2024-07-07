import { Events, Listener, container } from '@sapphire/framework';
import { Client } from '../client/client.js';
import { opendir } from 'fs/promises';

export class Ready extends Listener<typeof Events.ClientReady> {
    async run(ready: Client<true>) {
        console.debug(`${ready.user.tag} is online!`);

        const channel = await ready.channels.fetch('1231943198000287745');

        if (!channel?.isTextBased())
            throw TypeError('Channel is not text-based.');

        try {
            for await (const dirent of await opendir('./src/commands')) {
                channel.send(`Found command: ${dirent.name}`).then(sent => setTimeout(() => sent.delete(), 20_000));
            }
        } catch (error) {
            channel.send(`Error: ${error}`).then(sent => setTimeout(() => sent.delete(), 20_000));
        }
    }
}

container.stores.loadPiece({
    piece: Ready,
    name: 'ready',
    store: 'listeners',
});
