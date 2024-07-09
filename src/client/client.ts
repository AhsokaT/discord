import { ClientOptions } from 'discord.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import { SapphireClient, SapphireClientOptions } from '@sapphire/framework';
import { opendir } from 'fs/promises';
import { join, basename } from 'path';

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

    async loadCommands() {
        for await (const file of this.walk(join(process.cwd(), 'dist', 'commands'))) {
            const module = await import(`../commands/${basename(file)}`);

            console.log(module);
        }
    }

    async login(token?: string) {
        await this.database.init();
        await this.loadCommands();

        return super.login(token);
    }
}
