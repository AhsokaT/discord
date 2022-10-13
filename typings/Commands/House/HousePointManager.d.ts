import { TypedEmitter } from '../../../TypedEmitter';
export declare type HouseParticipants = 'TIGER' | 'OWL' | 'RAVEN' | 'TURTLE' | 'PANDA';
export declare type HousePoints = Record<HouseParticipants, number>;
export interface HousePointManagerEvent {
    update: (points: HousePoints) => void;
}
export declare class HousePointManager extends TypedEmitter<HousePointManagerEvent> {
    static dir: string;
    get points(): HousePoints;
    get sorted(): [string, number][];
    adjustPoints(house: HouseParticipants, points: number): HousePoints;
}
