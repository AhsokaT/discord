"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.ChannelIds = void 0;
const DatabaseManager_1 = require("../Database/DatabaseManager");
const framework_1 = require("@sapphire/framework");
var ChannelIds;
(function (ChannelIds) {
    ChannelIds["Logs"] = "1025143957186941038";
    ChannelIds["Competitions"] = "1028280826472955975";
})(ChannelIds || (exports.ChannelIds = ChannelIds = {}));
class Client extends framework_1.SapphireClient {
    database;
    constructor(options) {
        super(options);
        this.database = new DatabaseManager_1.DatabaseManager(this);
    }
    async login(token) {
        await this.database.init();
        return super.login(token);
    }
}
exports.Client = Client;
