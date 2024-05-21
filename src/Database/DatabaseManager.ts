import { MongoClient } from 'mongodb';
import { Client } from '../Client/client';
import { House, HouseId } from '../util/enum';

export interface HouseDocument {
    _id: HouseId;
    points: number;
}

export type HousePoints = Record<HouseId, number>;

export class DatabaseManager {
    readonly mongo: MongoClient;
    readonly cache: Map<HouseId, number>;

    constructor(readonly client: Client, mongoUrl = process.env.MONGO_URL) {
        if (mongoUrl == null)
            throw TypeError('MONGO_URL is not defined in .env or passed to constructor.');

        this.client = client;
        this.cache = new Map();
        this.mongo = new MongoClient(mongoUrl);
    }

    get sorted() {
        return House.ids.map(name => [name, this.cache.get(name)] as [HouseId, number]).sort((a, b) => b[1] - a[1]);
    }

    async connect() {
        await this.mongo.connect();

        return {
            [Symbol.dispose]: () => this.mongo.close(),
            [Symbol.asyncDispose]: () => this.mongo.close(),
            db: this.mongo.db('Raven'),
            collection: this.mongo.db('Raven').collection<HouseDocument>('Houses')
        };
    }

    async init() {
        using connection = await this.connect();

        const houses = await connection.collection.find().toArray();

        for (const house of houses)
            this.cache.set(house._id, house.points);

        return houses;
    }

    async patch(data: [id: HouseId, points: number][]) {
        using connection = await this.connect();

        const operations = data.map(([id, points]) => ({ updateOne: { filter: { _id: id }, update: { $set: { points } } } }));

        await connection.collection.bulkWrite(operations);

        for (const [id, points] of data)
            this.cache.set(id, points);
    }
}