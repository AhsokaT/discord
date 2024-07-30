import { Command } from '@sapphire/framework';
import {
    createSettingsComponents,
    createSettingsEmbed,
    PieceOptions,
} from '../../util/util.js';

@PieceOptions({
    name: 'plugins',
    description: 'View and modify plugins for this application',
    preconditions: ['CachedGuild'],
})
export class Plugins extends Command {
    async chatInputRun(
        interaction: Command.ChatInputCommandInteraction<'cached'>
    ) {
        let guildData = await interaction.client.guildData.fetch(interaction.guildId);

        interaction.reply({
            embeds: [createSettingsEmbed(interaction, guildData)],
            components: createSettingsComponents(guildData),
            ephemeral: true,
        });
    }
}
