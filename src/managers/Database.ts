import { MongoClient, Document } from 'mongodb';
import assert from 'assert/strict';

export class Database<D extends Document> implements AsyncDisposable {
    constructor(readonly mongo: MongoClient) {}

    [Symbol.asyncDispose](): Promise<void> {
        return this.mongo.close();
    }

    async create(guildId: string) {
        // noop
    }

    async delete(guildId: string) {
        // noop
    }

    static async connect<D extends Document>(
        mongoUrl = process.env.MONGO_URL
    ): Promise<Database<D>> {
        assert.ok(
            mongoUrl,
            TypeError(
                'No mongo URL was passed or found in environment variables.'
            )
        );

        const mongo = await MongoClient.connect(mongoUrl);

        return new this<D>(mongo);
    }
}
