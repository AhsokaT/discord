import { ClientEvents } from 'discord.js';

export type EventListener<E extends keyof ClientEvents> = (...args: ClientEvents[E]) => void;

export class Event<E extends keyof ClientEvents> {
    constructor(readonly event: E, public listener: EventListener<E> = () => {}) {
        this.event = event;
    }

    onEvent(perform: EventListener<E>) {
        this.listener = perform;
    }
}