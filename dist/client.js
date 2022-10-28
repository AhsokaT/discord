"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.ChannelID = void 0;
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const HousePointManager_1 = require("./Commands/House/HousePointManager");
const DataBase_1 = require("./DataBase/DataBase");
var ChannelID;
(function (ChannelID) {
    ChannelID["Logs"] = "1025143957186941038";
    ChannelID["Competitions"] = "1028280826472955975";
    ChannelID["RAVEN"] = "1023373249733738536";
    ChannelID["TIGER"] = "1023372920170483713";
    ChannelID["OWL"] = "1023373108389883979";
    ChannelID["TURTLE"] = "1023373586465046528";
    ChannelID["PANDA"] = "1023373723551666296";
})(ChannelID = exports.ChannelID || (exports.ChannelID = {}));
class Client extends discord_js_1.Client {
    commands = new js_augmentations_1.Collection();
    newCommands = new js_augmentations_1.Collection();
    housePointManager;
    database;
    constructor(options) {
        super(options);
        this.database = new DataBase_1.DataBaseManager(options.mongoURL);
        this.housePointManager = new HousePointManager_1.HousePointManager(this);
        this.on('interactionCreate', interaction => this.receiveInteraction(interaction));
        this.on('interactionCreate', interaction => this.receiveInteractionNew(interaction));
    }
    fetchDO() {
        return this.guilds.fetch('509135025560616963');
    }
    fetchCompetitionChannel() {
        return new Promise(async (res, rej) => {
            const channel = await this.channels.fetch(ChannelID.Competitions);
            if (!channel || !channel.isTextBased())
                rej('Channel could not be fetched or channel was not text-based.');
            else
                res(channel);
        });
    }
    fetchLogChannel() {
        return new Promise(async (res, rej) => {
            const channel = await this.channels.fetch(ChannelID.Logs);
            if (!channel || !channel.isTextBased())
                rej('Channel could not be fetched or channel was not text-based.');
            else
                res(channel);
        });
    }
    async sendToCompetitionsChannel(content) {
        const channel = await this.fetchCompetitionChannel();
        if (channel && channel.isTextBased())
            return channel.send(content);
        throw Error('Unable to fetch competitions channel.');
    }
    async sendToLogChannel(message) {
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
    addCommands(...commands) {
        commands.forEach(command => {
            this.newCommands.add(command);
            command.guilds.forEach(id => {
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
