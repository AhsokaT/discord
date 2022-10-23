import { TypedEmitter } from '../../../TypedEmitter';
import { readFileSync, writeFileSync } from 'fs';
import { House } from './house';

export type HouseParticipants =
    | 'TIGER'
    | 'OWL'
    | 'RAVEN'
    | 'TURTLE'
    | 'PANDA';

export type HousePoints = Record<HouseParticipants, number>;

export interface HousePointManagerEvent {
    update: (points: HousePoints) => void;
}

export class HousePointManager extends TypedEmitter<HousePointManagerEvent> {
    static dir = './housePoints.json';

    get points() {
        return JSON.parse(readFileSync(HousePointManager.dir, { encoding: 'utf-8' })) as HousePoints;
    }

    get sorted() {
        return Object.keys(House).map(name => [name, this.points[name]] as [string, number]).sort((a, b) => b[1] - a[1]);
    }

    get first() {
        let points = this.sorted[0]![1];

        return this.sorted.filter(house => house[1] === points);
    }

    get second() {
        let points = this.sorted[1]![1];

        return this.sorted.filter(house => house[1] === points);
    }

    get third() {
        let points = this.sorted[2]![1];

        return this.sorted.filter(house => house[1] === points);
    }

    get fourth() {
        let points = this.sorted[3]![1];

        return this.sorted.filter(house => house[1] === points);
    }

    get fith() {
        let points = this.sorted[4]![1];

        return this.sorted.filter(house => house[1] === points);
    }

    adjustPoints(house: HouseParticipants, points: number) {
        const current = this.points;

        current[house] += points;

        writeFileSync(HousePointManager.dir, JSON.stringify(current, void 0, 4));

        this.emit('update', this.points);

        return this.points;
    }
}