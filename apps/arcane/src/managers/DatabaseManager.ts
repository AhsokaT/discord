import { APIApplicationCommand, APIGuild, REST, Routes } from 'discord.js';
import { Client } from '../client/client.js';
import { COMMANDS, SETTINGS } from '../util/util.js';
import { MongoClient } from 'mongodb';
import { PluginBitField, PluginBits } from '../util/PluginBitField.js';
import { BitField } from '../util/BitField.js';
import assert from 'node:assert/strict';

export interface GuildDocument {
    _id: string;
    plugins: string;
}

export interface GuildDataEditOptions {
    plugins?: BitField.BitLike<keyof typeof PluginBits, number>;
}

export interface GuildDataPatchOptions {
    plugins?: BitField.BitLike<keyof typeof PluginBits, number>;
    commands?: APIApplicationCommand[];
}

export class GuildData {
    static from(client: Client, document: GuildDocument) {
        return new this(client, document._id, new PluginBitField(Number(document.plugins)));
    }

    static resolveOptions(options: GuildDataEditOptions) {
        return {
            plugins: options.plugins != null ? PluginBitField.reduce(options.plugins).toString() : '0'
        };
    }

    constructor(
        readonly client: Client,
        readonly id: string,
        readonly plugins = new PluginBitField(),
        readonly commands: Map<string, APIApplicationCommand> = new Map()
    ) {}

    _patch(data: GuildDataPatchOptions) {
        if (data.plugins != null)
            this.plugins.bits = PluginBitField.reduce(data.plugins);

        if (data.commands != null) {
            this.commands.clear();

            for (const command of data.commands)
                this.commands.set(command.id, command);
        }
    }

    async edit(data: GuildDataEditOptions) {
        await this.client.guildData.patch(this.id, data);

        return this;
    }

    setPlugins(plugins: BitField.BitLike<keyof typeof PluginBits, number>) {
        return this.edit({ plugins });
    }

    toJSON(): GuildDocument {
        return { _id: this.id, plugins: this.plugins.bits.toString() };
    }
}

export class GuildDataManager {
    readonly mongo: MongoClient;
    readonly cache: Map<string, GuildData>;
    readonly discordAppId: string;
    readonly rest: REST;

    constructor(
        readonly client: Client,
        mongoUrl = process.env.MONGO_URL,
        token = client.token ?? process.env.DISCORD_TOKEN,
        discordAppId = process.env.DISCORD_APP_ID
    ) {
        assert.ok(discordAppId, TypeError('DISCORD_APP_ID is not defined in .env or passed to the constructor.'));
        assert.ok(token, TypeError('DISCORD_TOKEN is not defined in .env or passed to the constructor.'));
        assert.ok(mongoUrl, TypeError('MONGO_URL is not defined in .env or passed to the constructor.'));

        this.discordAppId = discordAppId;
        this.cache = new Map();
        this.rest = new REST().setToken(token);
        this.mongo = new MongoClient(mongoUrl);
    }

    async connect() {
        await this.mongo.connect();

        return {
            collection: this.mongo.db('Arcane').collection<GuildDocument>('Guilds'),
            [Symbol.dispose]: (): void => void this.mongo.close(),
            [Symbol.asyncDispose]: () => this.mongo.close()
        };
    }

    async putCommands(id: string, groups: BitField.BitLike<keyof typeof PluginBits, number>) {
        const body: any[] = SETTINGS.slice();

        for (const group of Object.keys(COMMANDS)) {
            if (new PluginBitField(groups).has(Number(group)))
                body.push(...COMMANDS[group]);
        }

        const commands = await this.rest.put(Routes.applicationGuildCommands(this.discordAppId, id), { body }) as APIApplicationCommand[];

        this.cache.get(id)?._patch({ commands });

        return commands;
    }

    async init() {
        using database = await this.connect();

        const guilds = await this.rest.get(Routes.userGuilds()) as APIGuild[];

        const documents = await database.collection.find({ _id: { $in: guilds.map(guild => guild.id) } }).toArray();

        const deleted = await database.collection.deleteMany({ _id: { $nin: guilds.map(guild => guild.id) } });

        if (deleted.deletedCount > 0)
            console.debug(`Deleted ${deleted.deletedCount} guild documents.`);

        for (const document of documents)
            this.cache.set(document._id, GuildData.from(this.client, document));

        for (const guild of guilds) {
            if (this.cache.has(guild.id))
                continue;

            const data = new GuildData(this.client, guild.id);

            await database.collection.insertOne(data.toJSON());

            this.cache.set(guild.id, data);
        }

        for (const [id, guild] of this.cache) {
            const body: any[] = SETTINGS.slice();

            for (const group of Object.keys(COMMANDS)) {
                if (guild.plugins.has(Number(group)))
                    body.push(...COMMANDS[group]);
            }

            const response = await this.rest.put(Routes.applicationGuildCommands(this.discordAppId, id), { body }) as APIApplicationCommand[];

            this.cache.set(id, new GuildData(this.client, id, guild.plugins, new Map(response.map(command => [command.id, command]))));
        }
    }

    async create(id: string) {
        const cached = this.cache.get(id);

        if (cached)
            return cached;

        using database = await this.connect();
        const data = new GuildData(this.client, id);

        await database.collection.insertOne(data.toJSON());
    
        this.cache.set(id, data);

        await this.putCommands(id, data.plugins);

        return data;
    }

    async delete(id: string) {
        using database = await this.connect();

        await database.collection.deleteOne({ _id: id });

        this.cache.delete(id);
    }

    async patch(id: string, data: GuildDataEditOptions) {
        using database = await this.connect();

        await database.collection.updateOne({ _id: id }, { $set: GuildData.resolveOptions(data) });

        if (data.plugins != null)
            await this.putCommands(id, data.plugins);

        this.cache.get(id)?._patch({ plugins: data.plugins });
    }

    async fetch(id: string) {
        if (this.cache.has(id))
            return this.cache.get(id)!;

        using database = await this.connect();

        const data = await database.collection.findOne({ _id: id });

        if (data !== null)
            return GuildData.from(this.client, data);

        return this.create(id);
    }
}