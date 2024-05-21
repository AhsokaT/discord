"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseInfo = void 0;
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
let HouseInfo = class HouseInfo extends framework_1.InteractionHandler {
    async run(interaction) {
        interaction.reply({
            ephemeral: true,
            content: 'This button does nothing yet!'
        }).catch(console.warn);
    }
    parse(interaction) {
        return /^HOUSEINFO/.test(interaction.customId) ? this.some() : this.none();
    }
};
exports.HouseInfo = HouseInfo;
exports.HouseInfo = HouseInfo = __decorate([
    (0, decorators_1.ApplyOptions)({
        interactionHandlerType: framework_1.InteractionHandlerTypes.Button
    })
], HouseInfo);
framework_1.container.stores.loadPiece({
    piece: HouseInfo,
    name: HouseInfo.name,
    store: 'interaction-handlers'
});
