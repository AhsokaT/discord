"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePointManager = void 0;
const TypedEmitter_1 = require("../../../TypedEmitter");
const fs_1 = require("fs");
const house_1 = require("./house");
class HousePointManager extends TypedEmitter_1.TypedEmitter {
    static dir = './housePoints.json';
    get points() {
        return JSON.parse((0, fs_1.readFileSync)(HousePointManager.dir, { encoding: 'utf-8' }));
    }
    get sorted() {
        return Object.keys(house_1.House).map(name => [house_1.House[name], this.points[name]]).sort((a, b) => b[1] - a[1]);
    }
    adjustPoints(house, points) {
        const current = this.points;
        current[house] += points;
        (0, fs_1.writeFileSync)(HousePointManager.dir, JSON.stringify(current, void 0, 4));
        this.emit('update', this.points);
        return this.points;
    }
}
exports.HousePointManager = HousePointManager;
