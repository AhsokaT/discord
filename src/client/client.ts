import { ClientOptions } from 'discord.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import {
    Command,
    SapphireClient,
    SapphireClientOptions,
    StoreRegistryEntries,
    StoreRegistryKey,
} from '@sapphire/framework';
import { opendir } from 'fs/promises';
import { join, basename } from 'path';

type _ = StoreRegistryEntries['commands'];

export class Client<
    Ready extends boolean = boolean
> extends SapphireClient<Ready> {
    readonly database: DatabaseManager;

    constructor(options: ClientOptions & SapphireClientOptions) {
        super(options);

        this.database = new DatabaseManager(this);
    }

    async *walk(path: string): AsyncGenerator<string> {
        const dir = await opendir(path);

        for await (const dirent of dir) {
            if (dirent.isDirectory()) yield* this.walk(join(dir.path, dirent.name));
            else if (dirent.isFile()) yield join(dir.path, dirent.name);
        }
    }

    async loadPieces(path: string, storeRegistryKey: StoreRegistryKey) {
        for await (const file of this.walk(path)) {
            const module = await import(`../${basename(path)}/${basename(file)}`);
            const store = this.stores.get(storeRegistryKey);

            for (const value of Object.values(module)) {
                if (typeof value !== 'function') continue;
                if (!store.Constructor.prototype.isPrototypeOf(value)) continue;

                // @ts-expect-error
                store.loadPiece({ name: value.name, piece: value });
            }
        }
    }

    async login(token?: string) {
        await this.database.init();
        await this.loadPieces(join(process.cwd(), 'dist', 'commands'), 'commands');
        await this.loadPieces(join(process.cwd(), 'dist', 'listeners'), 'listeners');
        await this.loadPieces(join(process.cwd(), 'dist', 'handlers'), 'interaction-handlers');

        return super.login(token);
    }
}
