import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageActionRowComponentBuilder,
} from 'discord.js';
import { COMMANDS, PieceOptions, commandStr } from '../util/util.js';
import { PluginBits } from '../util/PluginBitField.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class UserInfo extends InteractionHandler {
    async run(interaction: ButtonInteraction) {
        if (!interaction.inGuild())
            return void interaction.deferUpdate();
    
        const client = interaction.client;
        const guild = client.guildData.cache.get(interaction.guildId) ?? await client.guildData.create(interaction.guildId);
        const [_, selection] = interaction.customId.split('_');
    
        if (guild.plugins.bits === 0)
            return void interaction.update({ content: 'No plugins enabled' });
    
                    // @ts-expect-error
        if (!guild.plugins.has(PluginBits[selection]))
            return void interaction.update({ content: 'Plugin is disabled', embeds: [], components: [] });
    
                    // @ts-expect-error
        const commands = [...guild.commands.values()].filter(command => COMMANDS[PluginBits[selection]].find(body => body.name === command.name)).map(commandStr).join('\n\n');
    
        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTitle(selection.replace(/([A-Z])/g, ' $1').trim())
            .setDescription(commands);
    
        const components = guild.plugins.toArray().map(plugin =>
            new ButtonBuilder()
                .setCustomId(`HELP_${plugin}`)
                .setLabel(plugin.replace(/([A-Z])/g, ' $1').trim())
                .setStyle(ButtonStyle.Primary)
                .setDisabled(plugin === selection)
        );
    
        const actions = new ActionRowBuilder<MessageActionRowComponentBuilder>({ components });
    
        interaction.update({ embeds: [embed], components: [actions] });
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('HELP') ? this.some() : this.none();
    }
}