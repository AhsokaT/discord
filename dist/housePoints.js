"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousePoints = void 0;
const housePicker_1 = require("./Commands/House/housePicker");
class HousePoints {
    TIGER = 0;
    OWL = 0;
    RAVEN = 0;
    TURTLE = 0;
    PANDA = 0;
    static difference(h1, h2) {
        return new HousePoints(Object.keys(h1).reduce((acc, h) => Object.assign(acc, { [h]: h1[h] - h2[h] }), new HousePoints()));
    }
    static equals(h1, h2) {
        return Object.keys(h1).every(h => h1[h] === h2[h]);
    }
    static sample() {
        return Object.keys(housePicker_1.House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), new HousePoints());
    }
    constructor(points) {
        if (points)
            Object.assign(this, points);
    }
    toJSON() {
        return JSON.stringify(Object.assign({}, this));
    }
    difference(other) {
        return HousePoints.difference(this, other);
    }
    equals(other) {
        return HousePoints.equals(this, other);
    }
    copy() {
        return new HousePoints(this);
    }
}
exports.HousePoints = HousePoints;
