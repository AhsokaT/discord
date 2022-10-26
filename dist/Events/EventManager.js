"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
class EventManager {
    client;
    constructor(client) {
        this.client = client;
        this.client = client;
    }
    onEvent(event, listener) {
        this.client.on(event, listener);
        return this;
    }
    onceEvent(event, listener) {
        this.client.once(event, listener);
        return this;
    }
}
exports.EventManager = EventManager;
