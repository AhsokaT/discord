import { Listener, Events } from '@sapphire/framework';
import { Client } from '../client/client.js';

export class ReadyListener extends Listener<typeof Events.ClientReady> {
    run(ready: Client<true>) {
        console.debug(`${ready.user.username} is online!`);
    }
}
