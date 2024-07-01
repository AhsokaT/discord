import { ClientOptions } from 'discord.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import { SapphireClient, SapphireClientOptions } from '@sapphire/framework';

export class Client<Ready extends boolean = boolean> extends SapphireClient<Ready> {
    readonly database: DatabaseManager;

    constructor(options: ClientOptions & SapphireClientOptions) {
        super(options);

        this.database = new DatabaseManager(this);
    }

    async login(token?: string) {
        await this.database.init();
        return super.login(token);
    }
}