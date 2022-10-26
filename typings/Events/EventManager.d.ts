import { ClientEvents } from 'discord.js';
import { Client } from '../client';
export declare type EventListener<E extends keyof ClientEvents> = (...args: ClientEvents[E]) => void;
export declare class EventManager {
    readonly client: Client;
    constructor(client: Client);
    onEvent<K extends keyof ClientEvents>(event: K, listener: EventListener<K>): this;
    onceEvent<K extends keyof ClientEvents>(event: K, listener: EventListener<K>): this;
}
