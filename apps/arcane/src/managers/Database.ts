import assert from 'assert/strict';
import { MongoClient } from 'mongodb';
import { Client } from '../client/client.js';

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
    private constructor(readonly mongo: MongoClient, readonly client: Client) {}

    [Symbol.asyncDispose](): Promise<void> {
        return this.mongo.close();
    }

    async createGuildDocument(guildId: string) {
        // noop
    }

    async deleteGuildDocument(guildId: string) {
        // noop
    }

    async createUserDocument(userId: string) {
        const document: Database.UserDocument = {
            _id: userId,
            playlists: [],
        };

        const result = await this.mongo
            .db('Arcane')
            .collection<Database.UserDocument>('Users')
            .insertOne(document);

        return document;
    }

    async getUserDocument(userId: string) {
        const document = await this.mongo
            .db('Arcane')
            .collection<Database.UserDocument>('Users')
            .findOne({ _id: userId });

        if (document)
            this.client.userCache.set(userId, document);

        return document;
    }

    async patchUserDocument(userId: string, patch: Partial<Database.UserDocument>) {
        const result = await this.mongo
            .db('Arcane')
            .collection<Database.UserDocument>('Users')
            .updateOne({ _id: userId }, { $set: patch });

        return result.upsertedId;
    }

    async deleteUserDocument(userId: string) {
        const result = await this.mongo
            .db('Arcane')
            .collection<Database.UserDocument>('Users')
            .deleteOne({ _id: userId });

        return result.deletedCount;
    }

    static async connect(client: Client, mongoUrl = process.env.MONGO_URL): Promise<Database> {
        assert.ok(
            mongoUrl,
            TypeError(
                'No mongo URL was passed or found in environment variables.'
            )
        );

        const mongo = await MongoClient.connect(mongoUrl);

        return new this(mongo, client);
    }
}
