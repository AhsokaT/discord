"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePointManager = void 0;
const TypedEmitter_1 = require("../../../TypedEmitter");
const fs_1 = require("fs");
class HousePointManager extends TypedEmitter_1.TypedEmitter {
    static dir = './housePoints.json';
    get points() {
        return JSON.parse((0, fs_1.readFileSync)(HousePointManager.dir, { encoding: 'utf-8' }));
    }
    assignPoints(house, points) {
        const current = this.points;
        current[house] += points;
        (0, fs_1.writeFileSync)('./housePoints.json', JSON.stringify(current, void 0, 4));
        this.emit('pointsAssigned', house, points);
        this.emit('update', this.points);
        return this.points;
    }
    removePoints(house, points) {
        const current = this.points;
        current[house] -= points;
        (0, fs_1.writeFileSync)(HousePointManager.dir, JSON.stringify(current, void 0, 4));
        this.emit('pointsRemoved', house, points);
        this.emit('update', this.points);
        return this.points;
    }
}
exports.HousePointManager = HousePointManager;
