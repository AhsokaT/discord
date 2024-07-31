import { SapphireClient, SapphireClientOptions } from '@sapphire/framework';
import { ClientOptions, Snowflake } from 'discord.js';
import { join } from 'path';
import { CommandManager } from '../managers/CommandManager.js';
import { GuildDataManager } from '../managers/DatabaseManager.js';
import { Subscription } from '../structs/Subscription.js';
import { Database } from '../managers/Database.js';

export class Client<
    Ready extends boolean = boolean
> extends SapphireClient<Ready> {
    readonly subscriptions: Map<Snowflake, Subscription>;
    readonly videoCache: Map<string, Subscription.VideoLike>;
    readonly guildData: GuildDataManager;
    readonly commands: CommandManager;
    readonly userCache: Map<string, Database.UserDocument>;

    constructor(options: ClientOptions & SapphireClientOptions) {
        super(options);

        this.stores
            .get('interaction-handlers')
            .registerPath(join(process.cwd(), 'dist', 'interactions'));

        this.userCache = new Map();
        this.videoCache = new Map();
        this.subscriptions = new Map();
        this.commands = new CommandManager(this);
        this.guildData = new GuildDataManager(this);
    }

    async login(token?: string) {
        console.log('Logging in...');

        await this.guildData.init();

        return super.login(token);
    }
}

declare module 'discord.js' {
    interface Client {
        readonly subscriptions: Map<Snowflake, Subscription>;
        readonly videoCache: Map<string, Subscription.VideoLike>;
        readonly guildData: GuildDataManager;
        readonly commands: CommandManager;
        readonly userCache: Map<string, Database.UserDocument>;
    }
}
