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
        return Object.keys(House).map(name => [House[name], this.points[name]] as [string, number]).sort((a, b) => b[1] - a[1]);
    }

    adjustPoints(house: HouseParticipants, points: number) {
        const current = this.points;

        current[house] += points;

        writeFileSync(HousePointManager.dir, JSON.stringify(current, void 0, 4));

        this.emit('update', this.points);

        return this.points;
    }
}