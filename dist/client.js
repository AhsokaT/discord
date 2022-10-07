"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const HousePointManager_1 = require("./Commands/House/HousePointManager");
class Client extends discord_js_1.Client {
    commands = new js_augmentations_1.Collection();
    newCommands = new js_augmentations_1.Collection();
    housePointManager = new HousePointManager_1.HousePointManager();
    constructor(options) {
        super(options);
        this.on('interactionCreate', interaction => this.receiveInteraction(interaction));
        this.on('interactionCreate', interaction => this.receiveInteractionNew(interaction));
    }
    addCommands(...commands) {
        commands.forEach(command => {
            this.newCommands.add(command);
            command.guilds.forEach(async (id) => {
                this.guilds.fetch(id)
                    .then(guild => command.commandBuilders.forEach(builder => guild.commands.create(builder)))
                    .catch(console.debug);
            });
        });
    }
    hasCustomID(interaction) {
        return 'customId' in interaction;
    }
    hasCommandName(interaction) {
        return 'commandName' in interaction;
    }
    receiveInteractionNew(interaction) {
        const command = this.newCommands.find(({ identifiers }) => {
            if (this.hasCustomID(interaction))
                return identifiers.some(id => interaction.customId.startsWith(id));
            if (this.hasCommandName(interaction))
                return identifiers.includes(interaction.commandName);
            return false;
        });
        console.log(command);
        if (!interaction.inCachedGuild())
            return;
        if (command)
            command.receive(interaction);
    }
    receiveInteraction(interaction) {
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
    registerCommand(command) {
        command.guilds.map(id => this.guilds.fetch(id)).forEach(async (promisedGuild) => {
            let guild;
            try {
                guild = await promisedGuild;
            }
            catch (err) {
                return console.error(`Unable to fetch guild: ${err}`);
            }
            command.commandBuilders.forEach(builder => {
                guild.commands.create(builder)
                    .catch(err => console.error(`Unable to create command in guild ${guild.name} ${guild.id}: ${err}`));
            });
        });
        this.commands.add(command);
    }
    registerCommands(...commands) {
        commands.forEach(command => this.registerCommand(command));
    }
}
exports.Client = Client;
