import { MongoClient } from 'mongodb';
import { HouseID, HousePoints } from '../Commands/House/HousePointManager';

interface Document {
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
        return this.database.collection<Document>('Houses');
    }

    async edit(id: HouseID, data: Partial<Omit<Document, '_id'>>, closeConnection = true): Promise<Document | null> {
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();

            this.status = MongoClientStatus.Connected;
        }

        let updated = await this.collection.findOneAndUpdate({ _id: id }, { $set: data });

        if (closeConnection && this.status === MongoClientStatus.Connected) {
            await this.client.close();

            this.status = MongoClientStatus.Disconnected;
        }

        return updated.value;
    }

    async fetch<House extends HouseID>(id: House): Promise<number | null> {
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();

            this.status = MongoClientStatus.Connected;
        }

        const document = await this.collection.findOne({ _id: id });

        if (this.status === MongoClientStatus.Connected) {
            await this.client.close();

            this.status = MongoClientStatus.Disconnected;
        }

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

        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();

            this.status = MongoClientStatus.Connected;
        }

        const documents = await this.collection.find().toArray();

        documents.forEach(document => record[document._id] = document.points);

        if (this.status === MongoClientStatus.Connected) {
            await this.client.close();

            this.status = MongoClientStatus.Disconnected;
        }

        return record;
    }
}