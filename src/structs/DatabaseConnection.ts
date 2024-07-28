import assert from 'assert/strict';
import { MongoClient } from 'mongodb';
import { HouseStore } from './HouseStore.js';
import { House } from '../util/enum.js';

export class DatabaseConnection implements AsyncDisposable {
    constructor(readonly store: HouseStore, readonly mongo: MongoClient) {}

    async [Symbol.asyncDispose]() {
        await this.mongo.close();
    }

    async patch(data: [id: House.id, points: number][]) {
        const operations = data.map(([id, points]) => ({
            updateOne: { filter: { _id: id }, update: { $set: { points } } },
        }));

        const result = await this.mongo
            .db('Raven')
            .collection<House.Document>('Houses')
            .bulkWrite(operations);

        if (!result.ok)
            console.warn(
                `[DATABASE] => Bulk operation did not execute correctly.`
            );

        for (const [id, points] of data) this.store.set(id, points);
    }

    async fetch() {
        const houses = await this.mongo
            .db('Raven')
            .collection<House.Document>('Houses')
            .find()
            .toArray();

        for (const house of houses) this.store.set(house._id, house.points);

        return houses;
    }

    static async connect(store: HouseStore, url = process.env.MONGO_URL) {
        assert.ok(url, 'Missing url argument.');
        return new DatabaseConnection(store, await MongoClient.connect(url));
    }
}
