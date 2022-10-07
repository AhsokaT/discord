// @ts-nocheck

import { EventEmitter } from 'events';

export type Listeners<L> = {
    [K in keyof L]: (...args: any[]) => void;
}

interface DefaultListener {
    [key: string]: (...args: any[]) => void;
}

export class TypedEmitter<L extends Listeners<L> = DefaultListener> extends EventEmitter {
    on<E extends keyof L>(event: E, listener: L[E]): this;
    once<E extends keyof L>(event: E, listener: L[E]): this;
    emit<E extends keyof L>(event: E, ...args: Parameters<L[E]>): boolean;
    off<E extends keyof L>(event: E, listener: L[E]): this;
    addListener<E extends keyof L>(event: E, listener: L[E]): this;
    prependListener<E extends keyof L>(event: E, listener: L[E]): this;
    prependOnceListener<E extends keyof L>(event: E, listener: L[E]): this;
    removeListener<E extends keyof L>(event: E, listener: L[E]): this;
    removeAllListeners<E extends keyof L>(event?: E): this;
    rawListeners<E extends keyof L>(event?: E): L[E][];
    listeners<E extends keyof L>(event?: E): L[E][];
    listenerCount<E extends keyof L>(event: E): number;
}