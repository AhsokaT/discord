import { TypedEmitter } from '../../../TypedEmitter';
import { readFileSync, writeFileSync } from 'fs';

export type HouseParticipants =
    | 'TIGER'
    | 'OWL'
    | 'RAVEN'
    | 'TURTLE'
    | 'PANDA';

export type HousePoints = Record<HouseParticipants, number>;

export interface HousePointManagerEvent {
    pointsAssigned: (house: HouseParticipants, points: number) => void;
    pointsRemoved: (house: HouseParticipants, points: number) => void;
    update: (points: HousePoints) => void;
}

export class HousePointManager extends TypedEmitter<HousePointManagerEvent> {
    static dir = './housePoints.json';

    get points() {
        return JSON.parse(readFileSync(HousePointManager.dir, { encoding: 'utf-8' })) as HousePoints;
    }

    assignPoints(house: HouseParticipants, points: number) {
        const current = this.points;

        current[house] += points;

        writeFileSync('./housePoints.json', JSON.stringify(current, void 0, 4));

        this.emit('pointsAssigned', house, points);
        this.emit('update', this.points);

        return this.points;
    }

    removePoints(house: HouseParticipants, points: number) {
        const current = this.points;

        current[house] -= points;

        writeFileSync(HousePointManager.dir, JSON.stringify(current, void 0, 4));

        this.emit('pointsRemoved', house, points);
        this.emit('update', this.points);

        return this.points;
    }
}