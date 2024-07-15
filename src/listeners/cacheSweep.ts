import { Listener, Events } from '@sapphire/framework';

export class CacheSweepListener extends Listener<typeof Events.CacheSweep> {
    run(message: string) {
        console.debug(message);
    }
}
