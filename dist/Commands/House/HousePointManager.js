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
        return Object.keys(house_1.House).map(name => [name, this.points[name]]).sort((a, b) => b[1] - a[1]);
    }
    get first() {
        let points = this.sorted[0][1];
        return this.sorted.filter(house => house[1] === points);
    }
    get second() {
        let points = this.sorted[1][1];
        return this.sorted.filter(house => house[1] === points);
    }
    get third() {
        let points = this.sorted[2][1];
        return this.sorted.filter(house => house[1] === points);
    }
    get fourth() {
        let points = this.sorted[3][1];
        return this.sorted.filter(house => house[1] === points);
    }
    get fith() {
        let points = this.sorted[4][1];
        return this.sorted.filter(house => house[1] === points);
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
