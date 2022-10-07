"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ban = void 0;
function ban(target, reason = '') {
    return target.ban({ reason });
}
exports.ban = ban;
