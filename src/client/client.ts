import { ClientOptions, Snowflake } from 'discord.js';
import { Subscription } from '../music/Subscription.js';
import { GuildDataManager } from '../managers/DatabaseManager.js';
import { join } from 'path';
import { CommandManager } from '../managers/CommandManager.js';
import { SapphireClient, SapphireClientOptions } from '@sapphire/framework';
import '@sapphire/plugin-subcommands/register';

export class Client<
    Ready extends boolean = boolean
> extends SapphireClient<Ready> {
    readonly subscriptions: Map<Snowflake, Subscription>;
    readonly videoCache: Map<string, Subscription.VideoLike>;
    readonly guildData: GuildDataManager;
    readonly commands: CommandManager;

    constructor(options: ClientOptions & SapphireClientOptions) {
        super(options);

        this.stores
            .get('interaction-handlers')
            .registerPath(join(process.cwd(), 'src', 'interactions'));

        this.videoCache = new Map();
        this.subscriptions = new Map();
        this.commands = new CommandManager(this);
        this.guildData = new GuildDataManager(this);
    }

    async login(token?: string) {
        await this.guildData.init();

        return super.login(token);
    }
}
