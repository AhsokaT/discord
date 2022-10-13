"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    event;
    listener;
    constructor(event, listener = () => { }) {
        this.event = event;
        this.listener = listener;
        this.event = event;
    }
    onEvent(perform) {
        this.listener = perform;
    }
}
exports.Event = Event;
