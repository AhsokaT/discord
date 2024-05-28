"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ready = void 0;
const framework_1 = require("@sapphire/framework");
class Ready extends framework_1.Listener {
    run(ready) {
        console.debug(`${ready.user.tag} is online!`);
    }
}
exports.Ready = Ready;
framework_1.container.stores.loadPiece({
    piece: Ready,
    name: 'ready',
    store: 'listeners'
});
