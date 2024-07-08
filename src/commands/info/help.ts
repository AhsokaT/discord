import { Command } from '@sapphire/framework';
import {
    APIApplicationCommand,
    ActionRowBuilder,
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

@PieceOptions({
    name: 'help',
    description: 'View useful information about this application',
})
export class Help extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild())
            return;

        const client = interaction.client;
        const guildData = client.guildData.cache.get(interaction.guildId) ?? await client.guildData.create(interaction.guildId);
        const commandId = interaction.options.getString('command');

        if (commandId && !guildData?.commands.has(commandId))
            return void interaction.reply({ content: 'Command not found', ephemeral: true });

        if (commandId) {
            const command = guildData.commands.get(commandId) ?? await interaction.guild.commands.fetch(commandId).then(fetched => fetched.toJSON() as APIApplicationCommand);

            if (!command)
                return void interaction.reply({ content: 'Command not found', ephemeral: true });

            const embed = new EmbedBuilder()
                .setColor('#2B2D31')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setTitle('/' + command.name);

            if (command.description)
                embed.setDescription(command.description);

            if (command.type === ApplicationCommandType.ChatInput) {
                const options = command.options?.map(option => `\`${option.name}${!option.required ? '?' : ''}\``).join(' ') || '';
                embed.addFields({ name: 'Usage', value: `</${command.name}:${command.id}> ${options}` });

                if (command.options && command.options.length > 0) {
                    const test = command.options.map(option => `\`${option.name}${!option.required ? '?' : ''}\` ${option.description}`).join(' ');
                    embed.addFields({ name: 'Options', value: test });
                }
            }

            if (command.default_member_permissions !== null) {
                const bitfield = new PermissionsBitField(BigInt(command.default_member_permissions));

                const permissions = bitfield.toArray().map(permission => `\`${permission}\``).join(' ');

                embed.addFields({ name: 'Default Permissions', value: permissions });
            }

            return void interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (guildData.plugins.bits === 0)
            return void interaction.reply({ content: 'No plugins enabled', ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });

        const [toDisplay] = guildData.plugins.toArray();

        const commands = [...guildData.commands.values()].filter(command => COMMANDS[PluginBits[toDisplay]].find(body => body.name === command.name)).map(commandStr).join('\n\n');

        embed.setTitle(toDisplay.replace(/([A-Z])/g, ' $1').trim());
        embed.setDescription(commands);

        const components = guildData.plugins.toArray().map((plugin, index) =>
            new ButtonBuilder()
                .setCustomId(`HELP_${plugin}`)
                .setLabel(plugin.replace(/([A-Z])/g, ' $1').trim())
                .setStyle(ButtonStyle.Primary)
                .setDisabled(index === 0)
        );

        const actions = new ActionRowBuilder<MessageActionRowComponentBuilder>({ components });

        interaction.reply({ embeds: [embed], components: [actions], ephemeral: true });
    }

    static readonly builder = new SlashCommandBuilder();

    static readonly plugin = PluginBits.Information;
}