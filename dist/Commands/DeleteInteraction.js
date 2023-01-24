"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_INTERACTION = void 0;
const template_1 = require("./template");
exports.DELETE_INTERACTION = new template_1.Command()
    .addIdentifiers('DELETEINTERACTION')
    .onButton(i => i.message.delete().catch(console.debug));
