import { TypedEmitter } from '../../../TypedEmitter';
import { Client } from '../../client';
export declare type HouseID = 'TIGER' | 'OWL' | 'RAVEN' | 'TURTLE' | 'PANDA';
export declare type HousePoints = Record<HouseID, number>;
export interface HousePointManagerEvent {
    update: (points: HousePoints) => void;
}
export declare class HousePointManager extends TypedEmitter<HousePointManagerEvent> {
    readonly client: Client;
    cache: HousePoints;
    clientStatus: 'connected' | 'disconnected';
    constructor(client: Client);
    private initCache;
    addPoints(house: HouseID, points: number, closeConnection?: boolean): Promise<HousePoints>;
    get sorted(): [string, number][];
}
