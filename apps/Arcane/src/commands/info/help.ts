import { Command } from '@sapphire/framework';
import {
    APIApplicationCommand,
    ActionRowBuilder,
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandOptionType,
    ApplicationCommandSubCommand,
    ApplicationCommandSubGroup,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageActionRowComponentBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
} from 'discord.js';
import { COMMANDS, commandStr, PieceOptions } from '../../util/util.js';
import { PluginBits } from '../../util/PluginBitField.js';
import assert from 'assert/strict';

type test = [parent: ApplicationCommand, ...subcommands: string[]][];

@PieceOptions({
    name: 'help',
    description: 'View useful information about this application',
})
export class Help extends Command {
    *_walk(command: ApplicationCommand) {
        if (command.options.length === 0)
            yield `</${command.name}:${command.id}>}`;
        else
            for (const str of this.walkOptions(command, command.options))
                yield `</${command.name}${str}`;
    }

    *walkOptions(
        command: ApplicationCommand,
        options: Iterable<ApplicationCommandOption>
    ): Generator<string> {
        for (const option of options) {
            if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
                if (option.options)
                    for (const subcommand of this.walkOptions(
                        command,
                        option.options
                    ))
                        yield ` ${option.name}${subcommand}`;
                else yield option.name;
            } else if (
                option.type === ApplicationCommandOptionType.Subcommand
            ) {
                yield ` ${option.name}:${command.id}> ${[
                    ...this.walkOptions(command, option.options ?? []),
                ].join(' ')}`;
            } else
                yield `:${command.id}> \`${option.name}${
                    !option.required ? '?' : ''
                }\``;
        }
    }

    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        assert.ok(interaction.inGuild());

        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client;
        let guild = interaction.guild;

        try {
            guild ??= await client.guilds.fetch(interaction.guildId);
        } catch {
            return interaction.editReply('Failed to fetch guild.');
        }

        const commands = await guild.commands.fetch();
        const query = interaction.options.getString('command');

        if (query) {
            const focused =
                commands.get(query) ??
                commands.find((command) => command.name === query);

            if (!focused)
                return interaction.editReply(
                    `Could not find a command that matches "${query}".`
                );

            const embed = new EmbedBuilder()
                .setColor('#2B2D31')
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTitle('/' + focused.name);

            if (focused.description) embed.setDescription(focused.description);

            return interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle('Arcane');

        let description = commands
            .map((command) => [...this._walk(command)])
            .flat()
            .join('\n');

        embed.setDescription(description);

        interaction.editReply({ embeds: [embed] });
    }

    async _chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        assert.ok(interaction.inGuild());

        const client = interaction.client;
        const guildData =
            client.guildData.cache.get(interaction.guildId) ??
            (await client.guildData.create(interaction.guildId));
        const commandId = interaction.options.getString('command');

        if (commandId && !guildData?.commands.has(commandId))
            return interaction.reply({
                content: 'Command not found',
                ephemeral: true,
            });

        if (commandId) {
            const command =
                guildData.commands.get(commandId) ??
                (await interaction.guild?.commands
                    .fetch(commandId)
                    .then(
                        (fetched) => fetched.toJSON() as APIApplicationCommand
                    ));

            if (!command)
                return interaction.reply({
                    content: 'Command not found',
                    ephemeral: true,
                });

            const embed = new EmbedBuilder()
                .setColor('#2B2D31')
                .setAuthor({
                    name: interaction.client.user.username,
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                .setTitle('/' + command.name);

            if (command.description) embed.setDescription(command.description);

            if (command.type === ApplicationCommandType.ChatInput) {
                const options =
                    command.options
                        ?.map(
                            (option) =>
                                `\`${option.name}${
                                    !option.required ? '?' : ''
                                }\``
                        )
                        .join(' ') || '';

                embed.addFields({
                    name: 'Usage',
                    value: `</${command.name}:${command.id}> ${options}\n-# ? indicates optional arguments which may be omitted`,
                });

                if (command.options && command.options.length > 0) {
                    const test = command.options
                        .map(
                            (option) =>
                                `\`${option.name}${
                                    !option.required ? '?' : ''
                                }\` ${option.description}`
                        )
                        .join(' ');
                    embed.addFields({ name: 'Options', value: test });
                }
            }

            if (command.default_member_permissions !== null) {
                const bitfield = new PermissionsBitField(
                    BigInt(command.default_member_permissions)
                );

                const permissions = bitfield
                    .toArray()
                    .map((permission) => `\`${permission}\``)
                    .join(' ');

                embed.addFields({
                    name: 'Default Permissions',
                    value: permissions,
                });
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (guildData.plugins.bits === 0)
            return interaction.reply({
                content: 'No plugins enabled',
                ephemeral: true,
            });

        const embed = new EmbedBuilder().setColor('#2B2D31').setAuthor({
            name: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL(),
        });

        const [toDisplay] = guildData.plugins.toArray();

        const commands = [...guildData.commands.values()]
            .filter((command) =>
                COMMANDS[PluginBits[toDisplay]].find(
                    (body) => body.name === command.name
                )
            )
            .map(commandStr)
            .join('\n\n');

        embed.setTitle(toDisplay.replace(/([A-Z])/g, ' $1').trim());
        embed.setDescription(commands);

        const components = guildData.plugins.toArray().map((plugin, index) =>
            new ButtonBuilder()
                .setCustomId(`HELP_${plugin}`)
                .setLabel(plugin.replace(/([A-Z])/g, ' $1').trim())
                .setStyle(ButtonStyle.Primary)
                .setDisabled(index === 0)
        );

        const actions = new ActionRowBuilder<MessageActionRowComponentBuilder>({
            components,
        });

        interaction.reply({
            embeds: [embed],
            components: [actions],
            ephemeral: true,
        });
    }

    static readonly builder = new SlashCommandBuilder();

    static readonly plugin = PluginBits.Information;
}
