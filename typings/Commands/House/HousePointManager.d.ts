import { TypedEmitter } from '@pat.npm.js/discord-bot-framework';
export declare type HouseParticipants = 'TIGER' | 'OWL' | 'RAVEN' | 'TURTLE' | 'PANDA';
export declare type HousePoints = Record<HouseParticipants, number>;
export interface HousePointManagerEvent {
    pointsAssigned: (house: HouseParticipants, points: number) => void;
    pointsRemoved: (house: HouseParticipants, points: number) => void;
    update: (points: HousePoints) => void;
}
export declare class HousePointManager extends TypedEmitter<HousePointManagerEvent> {
    static dir: string;
    get points(): HousePoints;
    assignPoints(house: HouseParticipants, points: number): HousePoints;
    removePoints(house: HouseParticipants, points: number): HousePoints;
}
