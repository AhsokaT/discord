import { MongoClient } from 'mongodb';
import { HouseID, HousePoints } from '../Commands/House/HousePointManager';

interface HouseDocument {
    _id: string;
    points: number;
}

export enum MongoClientStatus {
    Connected,
    Disconnected
}

export class DataBaseManager {
    readonly client: MongoClient;
    public status: MongoClientStatus;

    constructor(mongoURL: string) {
        this.status = MongoClientStatus.Disconnected;
        this.client = new MongoClient(mongoURL);
    }

    get database() {
        return this.client.db('Raven');
    }

    get collection() {
        return this.database.collection<HouseDocument>('Houses');
    }

    async closeConnection() {
        if (this.status === MongoClientStatus.Connected) {
            await this.client.close();

            this.status = MongoClientStatus.Disconnected;
        }
    }

    async openConnection() {
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();

            this.status = MongoClientStatus.Connected;
        }
    }

    async edit(id: HouseID, data: Partial<Omit<HouseDocument, '_id'>>, closeConnection = true): Promise<HouseDocument | null> {
        await this.openConnection();

        let updated = await this.collection.findOneAndUpdate({ _id: id }, { $set: data });

        if (closeConnection)
            await this.closeConnection();

        return updated.value;
    }

    async fetch<House extends HouseID>(id: House): Promise<number | null> {
        await this.openConnection();

        const document = await this.collection.findOne({ _id: id });

        await this.closeConnection();

        return document ? document.points : null;
    }

    async fetchAll(): Promise<HousePoints> {
        const record: HousePoints = {
            'OWL': 0,
            'PANDA': 0,
            'TIGER': 0,
            'RAVEN': 0,
            'TURTLE': 0
        };

        await this.openConnection();

        const documents = await this.collection.find().toArray();

        documents.forEach(document => record[document._id] = document.points);

        await this.closeConnection();

        return record;
    }
}