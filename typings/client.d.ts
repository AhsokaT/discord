import { ApplicationCommandDataResolvable, Client as DJSClient, ClientOptions, Guild, Interaction, Snowflake } from 'discord.js';
import { Collection } from 'js-augmentations';
import { HousePointManager } from './Commands/House/HousePointManager';
import { Command as NewCommand } from './Commands/template';
export interface Command {
    receive(interaction: Interaction<'cached'>): void;
    get names(): string[];
    get guilds(): Snowflake[];
    get commandBuilders(): ApplicationCommandDataResolvable[];
}
export declare class Client<Ready extends boolean = boolean> extends DJSClient<Ready> {
    readonly commands: Collection<Command>;
    readonly newCommands: Collection<NewCommand<"cached">>;
    readonly housePointManager: HousePointManager;
    constructor(options: ClientOptions);
    fetchDO(): Promise<Guild>;
    addCommands(...commands: NewCommand[]): void;
    private hasCustomID;
    private hasCommandName;
    private receiveInteractionNew;
    private receiveInteraction;
    registerCommand(this: Client<true>, command: Command): void;
    registerCommands(this: Client<true>, ...commands: Command[]): void;
}
