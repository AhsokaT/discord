"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = void 0;
const ClientEvent_1 = require("./ClientEvent");
exports.sum = new ClientEvent_1.ClientEvent('channelUpdate', (oldChannel, newChannel) => {
    if (!oldChannel.isTextBased() || !newChannel.isTextBased())
        return;
});
