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

export enum ChannelID {
    Logs = '1025143957186941038',
    Competitions = '1028280826472955975',
    RAVEN = '1023373249733738536',
    TIGER = '1023372920170483713',
    OWL = '1023373108389883979',
    TURTLE = '1023373586465046528',
    PANDA = '1023373723551666296'
}

export class Client<Ready extends boolean = boolean> extends DJSClient<Ready> {
    readonly commands = new Collection<Command>();
    readonly newCommands = new Collection<NewCommand>();
    readonly housePointManager: HousePointManager;
    readonly database: DataBaseManager;

    constructor(options: ClientOptions & { mongoURL: string; }) {
        super(options);

        this.database = new DataBaseManager(options.mongoURL);
        this.housePointManager = new HousePointManager(this);

        this.on('interactionCreate', interaction => this.receiveInteraction(interaction));
        this.on('interactionCreate', interaction => this.receiveInteractionNew(interaction));
    }

    fetchDO(): Promise<Guild> {
        return this.guilds.fetch('509135025560616963');
    }

    fetchCompetitionChannel() {
        return new Promise<TextBasedChannel>(async (res, rej) => {
            const channel = await this.channels.fetch(ChannelID.Competitions);

            if (!channel || !channel.isTextBased())
                rej('Channel could not be fetched or channel was not text-based.');
            else
                res(channel);
        });
    }

    fetchLogChannel() {
        return new Promise<TextBasedChannel>(async (res, rej) => {
            const channel = await this.channels.fetch(ChannelID.Logs);

            if (!channel || !channel.isTextBased())
                rej('Channel could not be fetched or channel was not text-based.');
            else
                res(channel);
        });
    }

    async sendToCompetitionsChannel(content: Parameters<TextChannel['send']>[0]) {
        const channel = await this.fetchCompetitionChannel();

        if (channel && channel.isTextBased())
            return channel.send(content);

        throw Error('Unable to fetch competitions channel.');
    }

    async sendToChannel(id: Snowflake, message: Parameters<TextChannel['send']>[0]) {
        const channel = await this.channels.fetch(id);

        if (!channel || !channel.isTextBased())
            throw Error('Channel could not be fetched or channel was not text-based.');

        return channel.send(message);
    }

    async sendToLogChannel(message: Parameters<TextChannel['send']>[0]): Promise<Message<true>> {
        return new Promise((res, rej) => {
            this.fetchLogChannel()
                .then(channel => {
                    if (!channel)
                        return rej('Channel could not be fetched');
    
                    if (!channel.isTextBased() || channel.isDMBased())
                        return rej('Channel was not text-based or channel was DM-based.');
    
                    channel.send(message).then(res);
                })
                .catch(rej);
        });
    }

    addCommands(...commands: NewCommand[]) {
        commands.forEach(command => {
            this.newCommands.add(command);

            command.guilds.forEach(id => {
                this.guilds.fetch(id)
                    .then(guild => command.commandBuilders.forEach(builder => guild.commands.create(builder)))
                    .catch(console.debug);
            });
        });
    }

    private hasCustomID<I extends Interaction>(interaction: I): interaction is I & { customId: string; } {
        return 'customId' in interaction;
    }

    private hasCommandName<I extends Interaction>(interaction: I): interaction is I & { commandName: string; } {
        return 'commandName' in interaction;
    }

    private receiveInteractionNew(interaction: Interaction) {
        const command = this.newCommands.find(command => {
            if (this.hasCustomID(interaction))
                return command.identifiers.some(id => interaction.customId.split('_').shift() === id);

            if (this.hasCommandName(interaction))
                return command.identifiers.includes(interaction.commandName);

            return false;
        });

        if (!interaction.inCachedGuild())
            return console.debug('Interaction in uncached guild.');

        if (command) {
            command.receive(interaction);

            console.log(interaction.user.tag);
        }
    }

    private receiveInteraction(interaction: Interaction) {
        const command = this.commands.find(({ names }) => {
            if (interaction.isMessageComponent() || interaction.isModalSubmit())
                return names.some(name => interaction.customId.startsWith(name));

            if (interaction.isChatInputCommand() || interaction.isContextMenuCommand())
                return names.includes(interaction.commandName);

            return false;
        });

        if (!interaction.inCachedGuild())
            return console.debug(`Interaction called in non-cached guild: Guild ID ${interaction.guildId}`);

        if (command)
            command.receive(interaction);
    }

    registerCommand(this: Client<true>, command: Command) {
        command.guilds.map(id => this.guilds.fetch(id)).forEach(async promisedGuild => {
            let guild: Guild;

            try {
                guild = await promisedGuild;
            } catch (err) {
                return console.error(`Unable to fetch guild: ${err}`);
            }

            command.commandBuilders.forEach(builder => {
                guild.commands.create(builder)
                    .catch(err => console.error(`Unable to create command in guild ${guild.name} ${guild.id}: ${err}`));
            });
        });

        this.commands.add(command);
    }

    registerCommands(this: Client<true>, ...commands: Command[]) {
        commands.forEach(command => this.registerCommand(command));
    }
}