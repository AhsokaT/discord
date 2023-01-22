import { House } from './Commands/House/housePicker';
import { HouseID } from './Commands/House/HousePointManager';

export class HousePoints implements Record<HouseID, number> {
    TIGER = 0;
    OWL = 0;
    RAVEN = 0;
    TURTLE = 0;
    PANDA = 0;

    static difference(h1: HousePoints, h2: HousePoints) {
        return new HousePoints(Object.keys(h1).reduce((acc, h) => Object.assign(acc, { [h]: h1[h] - h2[h] }), new HousePoints()));
    }

    static equals(h1: HousePoints, h2: HousePoints) {
        return Object.keys(h1).every(h => h1[h] === h2[h]);
    }

    static sample() {
        return Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), new HousePoints());
    }

    constructor(points?: Partial<HousePoints>) {
        if (points)
            Object.assign(this, points);
    }

    toJSON() {
        return JSON.stringify(Object.keys(this).reduce((acc, h) => Object.assign(acc, { [h]: this[h] }), {}));
    }

    difference(other: HousePoints) {
        return HousePoints.difference(this, other);
    }

    equals(other: HousePoints) {
        return HousePoints.equals(this, other);
    }
}