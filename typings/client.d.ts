import { ApplicationCommandDataResolvable, Client as DJSClient, ClientOptions, Guild, Interaction, Message, Snowflake, TextBasedChannel, TextChannel } from 'discord.js';
import { Collection } from 'js-augmentations';
import { HousePointManager } from './Commands/House/HousePointManager';
import { Command as NewCommand } from './Commands/template';
import { DataBaseManager } from './DataBase/DataBase';
export interface Command {
    receive(interaction: Interaction<'cached'>): void;
    get names(): string[];
    get guilds(): Snowflake[];
    get commandBuilders(): ApplicationCommandDataResolvable[];
}
export declare enum ChannelID {
    Logs = "1025143957186941038",
    Competitions = "1028280826472955975",
    RAVEN = "1023373249733738536",
    TIGER = "1023372920170483713",
    OWL = "1023373108389883979",
    TURTLE = "1023373586465046528",
    PANDA = "1023373723551666296"
}
export declare class Client<Ready extends boolean = boolean> extends DJSClient<Ready> {
    readonly commands: Collection<Command>;
    readonly newCommands: Collection<NewCommand<"cached">>;
    readonly housePointManager: HousePointManager;
    readonly database: DataBaseManager;
    constructor(options: ClientOptions & {
        mongoURL: string;
    });
    fetchDO(): Promise<Guild>;
    fetchCompetitionChannel(): Promise<TextBasedChannel>;
    fetchLogChannel(): Promise<TextBasedChannel>;
    sendToCompetitionsChannel(content: Parameters<TextChannel['send']>[0]): Promise<Message<true> | Message<false>>;
    sendToChannel(id: Snowflake, message: Parameters<TextChannel['send']>[0]): Promise<Message<true> | Message<false>>;
    sendToLogChannel(message: Parameters<TextChannel['send']>[0]): Promise<Message<true>>;
    addCommands(...commands: NewCommand[]): void;
    private hasCustomID;
    private hasCommandName;
    private receiveInteractionNew;
    private receiveInteraction;
    registerCommand(this: Client<true>, command: Command): void;
    registerCommands(this: Client<true>, ...commands: Command[]): void;
}
