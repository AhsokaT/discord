export interface HousePoints {
    TIGER: number;
    OWL: number;
    RAVEN: number;
    TURTLE: number;
    PANDA: number;
}
export declare type HouseParticipants = 'TIGER' | 'OWL' | 'RAVEN' | 'TURTLE' | 'PANDA';
export declare class HousePointManager {
    static dir: string;
    get points(): HousePoints;
    assignPoints(house: HouseParticipants, points: number): void;
    removePoints(house: HouseParticipants, points: number): void;
}
