import { MongoClient } from 'mongodb';
import { HouseID, HousePoints } from '../Commands/House/HousePointManager';
interface HouseDocument {
    _id: string;
    points: number;
}
export declare enum MongoClientStatus {
    Connected = 0,
    Disconnected = 1
}
export declare class DataBaseManager {
    readonly client: MongoClient;
    status: MongoClientStatus;
    constructor(mongoURL: string);
    get database(): import("mongodb").Db;
    get collection(): import("mongodb").Collection<HouseDocument>;
    closeConnection(): Promise<void>;
    openConnection(): Promise<void>;
    edit(id: HouseID, data: Partial<Omit<HouseDocument, '_id'>>, closeConnection?: boolean): Promise<HouseDocument | null>;
    fetch<House extends HouseID>(id: House): Promise<number | null>;
    fetchAll(): Promise<HousePoints>;
}
export {};
