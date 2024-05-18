"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = void 0;
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
let Delete = class Delete extends framework_1.InteractionHandler {
    run(interaction) {
        interaction.message.delete();
    }
    parse(interaction) {
        return interaction.customId === 'DELETEINTERACTION' ? this.some() : this.none();
    }
};
exports.Delete = Delete;
exports.Delete = Delete = __decorate([
    (0, decorators_1.ApplyOptions)({
        interactionHandlerType: framework_1.InteractionHandlerTypes.Button
    })
], Delete);
