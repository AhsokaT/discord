import { MongoClient, Document } from 'mongodb';
import assert from 'assert/strict';

export namespace Database {
    export interface GuildDocument {
        _id: string;
        plugins: string;
    }

    export interface Playlist {
        name: string;
        tracks: string[];
    }

    export interface UserDocument {
        _id: string;
        playlists: Playlist[];
    }
}

export class Database implements AsyncDisposable {
    constructor(readonly mongo: MongoClient) {}

    [Symbol.asyncDispose](): Promise<void> {
        return this.mongo.close();
    }

    async createGuildDocument(guildId: string) {
        // noop
    }

    async delete(guildId: string) {
        // noop
    }

    static async connect(
        mongoUrl = process.env.MONGO_URL
    ): Promise<Database> {
        assert.ok(
            mongoUrl,
            TypeError(
                'No mongo URL was passed or found in environment variables.'
            )
        );

        const mongo = await MongoClient.connect(mongoUrl);

        return new this(mongo);
    }
}
