import { MongoClient } from 'mongodb';
import { HouseID, HousePoints } from '../Commands/House/HousePointManager';
interface Document {
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
    get collection(): import("mongodb").Collection<Document>;
    edit(id: HouseID, data: Partial<Omit<Document, '_id'>>, closeConnection?: boolean): Promise<Document | null>;
    fetch<House extends HouseID>(id: House): Promise<number | null>;
    fetchAll(): Promise<HousePoints>;
}
export {};
