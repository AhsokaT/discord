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

export class Client<Ready extends boolean = boolean> extends DJSClient<Ready> {
    readonly commands = new Collection<Command>();
    readonly newCommands = new Collection<NewCommand>();
    readonly housePointManager = new HousePointManager();

    constructor(options: ClientOptions) {
        super(options);

        this.on('interactionCreate', interaction => this.receiveInteraction(interaction));
        this.on('interactionCreate', interaction => this.receiveInteractionNew(interaction));
    }

    fetchDO(): Promise<Guild> {
        return this.guilds.fetch('509135025560616963');
    }

    addCommands(...commands: NewCommand[]) {
        commands.forEach(command => {
            this.newCommands.add(command);

            command.guilds.forEach(id => {
                this.guilds.fetch(id)
                    .then(guild => command.commandBuilders.forEach(builder => {
                        guild.commands.create(builder).then(appCmd => console.log(`${appCmd.name} ${appCmd.guild?.name}`));
                    }))
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

        if (command)
            command.receive(interaction);
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