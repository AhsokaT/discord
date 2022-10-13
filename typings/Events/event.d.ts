import { ClientEvents } from 'discord.js';
export declare type EventListener<E extends keyof ClientEvents> = (...args: ClientEvents[E]) => void;
export declare class Event<E extends keyof ClientEvents> {
    readonly event: E;
    listener: EventListener<E>;
    constructor(event: E, listener?: EventListener<E>);
    onEvent(perform: EventListener<E>): void;
}
