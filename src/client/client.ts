import { ClientOptions } from 'discord.js';
import { DatabaseManager } from '../database/DatabaseManager';
import { SapphireClient, SapphireClientOptions } from '@sapphire/framework';

export enum ChannelIds {
    Logs = '1025143957186941038',
    Competitions = '1028280826472955975',
}

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