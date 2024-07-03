import {
    APIApplicationCommand,
    APIGuildMember,
    ActionRowBuilder,
    ApplicationCommand,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    GuildMember,
    Interaction,
    MessageActionRowComponentBuilder,
    PermissionFlagsBits,
    Role,
} from 'discord.js';
import { GuildData } from '../managers/DatabaseManager.js';
import { InteractionHandler } from '@sapphire/framework';
import { Client } from '../client/client.js';
import { PluginBits } from './PluginBitField.js';

interface ResolvedGuildMemberData {
    nickname: string | null;
    roles: string[] | Role[];
    premiumSince: number | null;
    communicationDisabledUntil: number | null;
    joinedServer: number | null;
}

type ResolveOptions<Class extends new (...args: any[]) => any> =
    Class extends new (ctx: any, options: infer O) => any ? O : never;

export function PieceOptions<Class extends new (...args: any[]) => any>(
    overwrite:
        | ResolveOptions<Class>
        | ((options: ResolveOptions<Class>) => ResolveOptions<Class>)
) {
    return function (ctor: Class, ctx: ClassDecoratorContext<Class>) {
        return new Proxy(ctor, {
            construct(target, [loader, options = {}]) {
                if (typeof overwrite === 'function')
                    // @ts-expect-error
                    overwrite = overwrite(options);

                return new target(loader, { ...options, ...overwrite });
            },
        });
    };
}

export interface UsageDataDocument {
    _id: string;
    user: string;
    guild: string | null;
    timestamp: string;
    interactionHandlerType: number | null;
    commandType: number | null;
    name: string;
}

export function resolveGuildMemberData(
    member: GuildMember | APIGuildMember
): ResolvedGuildMemberData {
    if (member instanceof GuildMember)
        return {
            nickname: member.nickname,
            roles: [
                ...member.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .values(),
            ],
            premiumSince: member.premiumSinceTimestamp,
            communicationDisabledUntil:
                member.communicationDisabledUntilTimestamp,
            joinedServer: member.joinedTimestamp,
        };

    return {
        nickname: member.nick ?? null,
        roles: member.roles,
        premiumSince: member.premium_since
            ? Date.parse(member.premium_since)
            : null,
        communicationDisabledUntil: member.communication_disabled_until
            ? Date.parse(member.communication_disabled_until)
            : null,
        joinedServer: member.joined_at ? Date.parse(member.joined_at) : null,
    };
}

export function commandStr(
    command: ApplicationCommand | APIApplicationCommand
) {
    if (command.type !== ApplicationCommandType.ChatInput) return '';

    const options =
        command.options
            ?.map(
                (option) =>
                    `\`${option.name}${
                        'required' in option && !option.required ? '?' : ''
                    }\``
            )
            .join(' ') ?? '';

    return (
        (options &&
            `</${command.name}:${command.id}> ${options} \n${command.description}`) ||
        `</${command.name}:${command.id}> \n${command.description}`
    );
}

export function createSettingsComponents(guild: GuildData) {
    const enableButtons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>();
    const disableButtons =
        new ActionRowBuilder<MessageActionRowComponentBuilder>();

    for (const plugin of Object.keys(PluginBits) as PluginBits.Key[]) {
        const bits = PluginBits[plugin];

        (guild.plugins.has(bits)
            ? disableButtons
            : enableButtons
        ).addComponents(
            new ButtonBuilder()
                .setCustomId(`TOGGLE_${plugin}`)
                .setLabel(
                    `${guild.plugins.has(bits) ? 'Disable' : 'Enable'} ${plugin
                        .replace(/([A-Z])/g, ' $1')
                        .trim()}`
                )
                .setStyle(
                    guild.plugins.has(bits)
                        ? ButtonStyle.Danger
                        : ButtonStyle.Success
                )
        );
    }

    const components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

    enableButtons.components.length > 0 && components.push(enableButtons);
    disableButtons.components.length > 0 && components.push(disableButtons);

    return components;
}

export function createSettingsEmbed(
    interaction: Interaction,
    guild: GuildData
) {
    const embed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setTitle('Plugins')
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        });

    for (const plugin of Object.keys(PluginBits) as PluginBits.Key[]) {
        const commands = [...guild.commands.values()]
            .filter((command) =>
                COMMANDS[PluginBits[plugin]]?.find(
                    (body) => body.name === command.name
                )
            )
            .map((command) => `</${command.name}:${command.id}>`)
            .join(' ');

        if (commands.length === 0) continue;

        embed.addFields({
            name: plugin.replace(/([A-Z])/g, ' $1').trim(),
            value: commands,
        });
    }

    return embed;
}

export abstract class MusicInteractionHandler extends InteractionHandler {
    parse(interaction: Interaction) {
        if (!interaction.inCachedGuild()) return this.none();

        const client = interaction.client as Client<true>;

        const subscription = client.subscriptions.get(interaction.guildId);

        if (subscription == null) {
            if (interaction.isAutocomplete()) interaction.respond([]);
            else if (
                interaction.isMessageComponent() &&
                interaction.message.deletable
            )
                interaction.message.delete();

            return this.none();
        }

        return this.some(subscription);
    }
}

export const COMMANDS = {
    [PluginBits.Information.toString()]: [
        {
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
        },
        {
            name: 'ping',
            description: 'Ping pong!',
            type: ApplicationCommandType.ChatInput,
        },
        {
            name: 'statsfornerds',
            description: 'Stats for nerds',
            type: ApplicationCommandType.ChatInput,
        },
    ],
    [PluginBits.Music.toString()]: [
        {
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
        },
        {
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
        },
        {
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
        },
        {
            name: 'disconnect',
            description: 'Disconnect the bot from the voice channel',
            type: ApplicationCommandType.ChatInput,
        },
        {
            name: 'skip',
            description: 'Skip the current track',
            type: ApplicationCommandType.ChatInput,
        },
        {
            name: 'stop',
            description:
                'Will stop streaming audio but will remain in voice channel',
            type: ApplicationCommandType.ChatInput,
        },
        {
            name: 'queue',
            description: 'View and modify the current queue',
            type: ApplicationCommandType.ChatInput,
        },
        {
            name: 'clear',
            description: 'Clear the queue',
            type: ApplicationCommandType.ChatInput,
        },
    ],
} as const;

export const SETTINGS = [
    {
        name: 'plugins',
        description: 'View and modify plugins for this application',
        type: ApplicationCommandType.ChatInput,
        default_member_permissions: String(PermissionFlagsBits.ManageGuild),
    },
];
