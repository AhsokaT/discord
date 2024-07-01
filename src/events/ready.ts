import { Events, Listener, container } from '@sapphire/framework';
import { Client } from '../client/client.js';

export class Ready extends Listener<typeof Events.ClientReady> {
    run(ready: Client<true>) {
        console.debug(`${ready.user.tag} is online!`);
    }
}

container.stores.loadPiece({
    piece: Ready,
    name: 'ready',
    store: 'listeners',
});
