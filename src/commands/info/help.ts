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
    EmbedField,
    MessageActionRowComponentBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
} from 'discord.js';
import { COMMANDS, commandStr, PieceOptions } from '../../util/util.js';
import { PluginBits } from '../../util/PluginBitField.js';
import assert from 'assert/strict';

@PieceOptions({
    name: 'help',
    description: 'View useful information about this application',
})
export class Help extends Command {
    *walk(
        options: Iterable<
            | ApplicationCommand
            | ApplicationCommandSubGroup
            | ApplicationCommandSubCommand
        >
    ): Generator<string> {
        for (const option of options) {
            if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
                if (option.options)
                    for (const subcommand of this.walk(option.options))
                        yield `${option.name} ${subcommand}`;
                else yield option.name;
            } else if (option.type === ApplicationCommandOptionType.Subcommand) {
                yield option.name;
            }

            // const suboptions = option.options?.filter(
            //     (option) =>
            //         option.type ===
            //             ApplicationCommandOptionType.SubcommandGroup ||
            //         option.type === ApplicationCommandOptionType.Subcommand
            // );

            // const params = option.options?.filter(
            //     (option) =>
            //         option.type !==
            //             ApplicationCommandOptionType.SubcommandGroup &&
            //         option.type !== ApplicationCommandOptionType.Subcommand
            // );

            // let paramsStr =
            //     params?.reduce(
            //         (acc, param) =>
            //             `${acc} \`${param.name}${!param.required ? '?' : ''}\``,
            //         ''
            //     ) ?? '';

            // if (suboptions?.length)
            //     for (const name of this.walk(suboptions)) {
            //         console.log('walked:', name);
            //         yield `${option.name} ${name}`;
            //     }
            // else yield `${option.name} ${paramsStr}\n-# ${option.description}`;
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

        for (const [id, command] of commands) {
            // noop
        }

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

        let description = [...this.walk(commands.values())].join('\n');

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
