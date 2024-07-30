import {
    RESTPostAPIApplicationCommandsJSONBody,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    PermissionFlagsBits,
    Routes,
    APIApplicationCommand,
} from 'discord.js';
import { PluginBits } from '../util/PluginBitField.ts';
import { Client } from '../client/client.ts';
import { GuildData } from './DatabaseManager.ts';
import { Command } from '@sapphire/framework';

export class CommandRepository extends Set<Command> {
    async putCommands(guild: GuildData) {
        // noop
    }
}

export class CommandManager {
    readonly commands: Map<
        PluginBits.Bit,
        Set<RESTPostAPIApplicationCommandsJSONBody>
    >;

    constructor(readonly client: Client) {
        this.commands = new Map();
        this.init();
    }

    async load(guild: GuildData) {
        for (const key of guild.plugins.toArray()) {
            const commands = this.commands.get(PluginBits[key]);

            if (commands == null) continue;

            const endpoint = Routes.applicationGuildCommands(
                this.client.user!.id,
                guild.id
            );

            const put = (await this.client.rest.put(endpoint, {
                body: [...commands],
            })) as APIApplicationCommand[];

            guild.commands.clear();

            for (const command of put) guild.commands.set(command.id, command);
        }
    }

    private init() {
        const settings = new Set<RESTPostAPIApplicationCommandsJSONBody>();
        const information = new Set<RESTPostAPIApplicationCommandsJSONBody>();
        const music = new Set<RESTPostAPIApplicationCommandsJSONBody>();

        information
            .add({
                name: 'help',
                description: 'View useful information about this application',
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: 'command',
                        description:
                            'Specify a command to view its detailed information',
                        type: ApplicationCommandOptionType.String,
                        required: false,
                        autocomplete: true,
                    },
                ],
            })
            .add({
                name: 'ping',
                description: 'Ping pong!',
                type: ApplicationCommandType.ChatInput,
            })
            .add({
                name: 'statsfornerds',
                description: 'Stats for nerds',
                type: ApplicationCommandType.ChatInput,
            });

        music
            .add({
                name: 'play',
                description: 'Stream audio to a voice channel',
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: 'query',
                        description: 'YouTube URL or search query',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true,
                    },
                ],
            })
            .add({
                name: 'playlist',
                description: 'Empty',
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: 'create',
                        description: 'Create a playlist',
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: 'name',
                                description: 'Playlist name',
                                type: ApplicationCommandOptionType.String,
                                required: true,
                            },
                        ],
                    },
                ],
            })
            .add({
                name: 'remove',
                description: 'Remove a song from the queue',
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: 'song',
                        description: 'The song to remove from the queue',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true,
                    },
                ],
            })
            .add({
                name: 'disconnect',
                description: 'Disconnect the bot from the voice channel',
                type: ApplicationCommandType.ChatInput,
            })
            .add({
                name: 'skip',
                description: 'Skip the current track',
                type: ApplicationCommandType.ChatInput,
            })
            .add({
                name: 'stop',
                description:
                    'Will stop streaming audio but will remain in voice channel',
                type: ApplicationCommandType.ChatInput,
            })
            .add({
                name: 'queue',
                description: 'View and modify the current queue',
                type: ApplicationCommandType.ChatInput,
            })
            .add({
                name: 'clear',
                description: 'Clear the queue',
                type: ApplicationCommandType.ChatInput,
            });

        settings.add({
            name: 'plugins',
            description: 'View and modify plugins for this application',
            type: ApplicationCommandType.ChatInput,
            default_member_permissions:
                PermissionFlagsBits.ManageGuild.toString(),
        });

        this.commands
            .set(PluginBits.Settings, settings)
            .set(PluginBits.Information, information)
            .set(PluginBits.Music, music);
    }
}
