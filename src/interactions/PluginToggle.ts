import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { PieceOptions, createSettingsComponents, createSettingsEmbed } from '../util/util.js';
import { Client } from '../client/client.js';
import { PluginBits } from '../util/PluginBitField.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class PluginToggle extends InteractionHandler {
    async run(interaction: ButtonInteraction) {
        await interaction.deferUpdate();

        if (!interaction.inGuild())
            return;

        const client = interaction.client as Client;

        let guild = await client.guildData.fetch(interaction.guildId);

        const [, plugin] = interaction.customId.split('_') as [string, keyof typeof PluginBits];

        guild.plugins.toggle(PluginBits[plugin]);

        await guild.setPlugins([guild.plugins]);

        let components = createSettingsComponents(guild);

        components = components.map(row => row.setComponents(row.components.map(component => component.setDisabled(true))));

        const cooldownUntil = new Date();

        cooldownUntil.setTime(cooldownUntil.getTime() + 30_000);

        interaction.editReply({ embeds: [createSettingsEmbed(interaction, guild).setDescription(`:stopwatch: Cooldown ends <t:${Math.ceil(cooldownUntil.getTime() / 1000)}:R>`)], components }).catch(console.error);

        setTimeout(() => {
            interaction.editReply({ embeds: [createSettingsEmbed(interaction, guild)], components: createSettingsComponents(guild) }).catch(console.error);
        }, 30_000);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('TOGGLE') ? this.some() : this.none();
    }
}