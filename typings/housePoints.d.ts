import { HouseID } from './Commands/House/HousePointManager';
export declare class HousePoints implements Record<HouseID, number> {
    TIGER: number;
    OWL: number;
    RAVEN: number;
    TURTLE: number;
    PANDA: number;
    static difference(h1: HousePoints, h2: HousePoints): any;
    static equals(h1: HousePoints, h2: HousePoints): boolean;
    static sample(): HousePoints;
    constructor(points?: Partial<HousePoints>);
    toJSON(): string;
    difference(other: HousePoints): any;
    equals(other: HousePoints): boolean;
}
