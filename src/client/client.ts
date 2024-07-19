import { ClientOptions } from 'discord.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import {
    SapphireClient,
    SapphireClientOptions,
    StoreRegistryKey,
} from '@sapphire/framework';
import { opendir } from 'fs/promises';
import { join, basename, extname } from 'path';

export class Client<
    Ready extends boolean = boolean
> extends SapphireClient<Ready> {
    readonly database: DatabaseManager;
    readonly irohQuotes = [
        `Sometimes life is like this dark tunnel. You can't always see the light at the end of the tunnel, but if you just keep moving... you will come to a better place.`,
        `Pride is not the opposite of shame, but its source. True humility is the only antidote to shame.`,
        `When you're in your darkest place, you give yourself hope and that's inner strength.`,
        `Life happens wherever you are, whether you make it or not.`,
        `Sometimes the best way to solve your own problems is to help someone else.`,
        `Protection and power are overrated. I think you are very wise to choose happiness and love.`,
        `Failure is only the opportunity to begin again. Only this time, more wisely.`,
        `Sometimes the best way to solve your own problems is to help someone else.`,
        `It is important to draw wisdom from many different places. If you take it from only one place, it becomes rigid and stale. Understanding others, the other elements and the other nations will help you become whole.`,
    ];

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
                if (!store.Constructor.prototype.isPrototypeOf(value.prototype)) continue;

                // @ts-expect-error
                store.loadPiece({ name: basename(file).replace(extname(file), ''), piece: value });
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

declare module 'discord.js' {
    interface Client {
        readonly database: DatabaseManager;
        readonly irohQuotes: string[];
        walk(path: string): AsyncGenerator<string>;
        loadPieces(path: string, storeRegistryKey: StoreRegistryKey): Promise<void>;
    }
}
