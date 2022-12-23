"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePointManager = void 0;
const TypedEmitter_1 = require("../../../TypedEmitter");
const housePicker_1 = require("./housePicker");
class HousePointManager extends TypedEmitter_1.TypedEmitter {
    client;
    cache;
    clientStatus = 'disconnected';
    constructor(client) {
        super();
        this.client = client;
        this.client = client;
        this.cache = { OWL: 0, PANDA: 0, TIGER: 0, RAVEN: 0, TURTLE: 0 };
        this.initCache()
            .catch(console.debug);
    }
    async initCache() {
        this.cache = await this.client.database.fetchAll();
        return this.cache;
    }
    async addPoints(house, points, closeConnection = true) {
        await this.client.database.edit(house, { points: this.cache[house] + points }, closeConnection);
        this.cache[house] += points;
        return this.cache;
    }
    get sorted() {
        return Object.keys(housePicker_1.House).map(name => [name, this.cache[name]]).sort((a, b) => b[1] - a[1]);
    }
}
exports.HousePointManager = HousePointManager;
