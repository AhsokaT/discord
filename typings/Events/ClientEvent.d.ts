import { ClientEvents } from 'discord.js';
export declare class ClientEvent<K extends keyof ClientEvents> {
    readonly event: K;
    readonly listener: (...args: ClientEvents[K]) => void;
    constructor(event: K, listener: (...args: ClientEvents[K]) => void);
}
