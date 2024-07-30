import { SapphireClient, SapphireClientOptions } from '@sapphire/framework';
import '@sapphire/plugin-subcommands/register';
import { ClientOptions, Snowflake } from 'discord.js';
import { join } from 'path';
import { CommandManager } from '../managers/CommandManager.ts';
import { GuildDataManager } from '../managers/DatabaseManager.ts';
import { Subscription } from '../structs/Subscription.ts';
import { Database } from '../managers/Database.ts';

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
            .registerPath(join(process.cwd(), 'src', 'interactions'));

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
