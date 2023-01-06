import { ClientEvents } from 'discord.js';

export class ClientEvent<K extends keyof ClientEvents> {
    constructor(readonly event: K, readonly listener: (...args: ClientEvents[K]) => void) {
        this.event = event;
        this.listener = listener;
    }
}