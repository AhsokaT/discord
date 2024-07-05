import { Command } from '@sapphire/framework';
import {
    createSettingsComponents,
    createSettingsEmbed,
    PieceOptions,
} from '../../util/util.js';
import { Client } from '../../client/client.js';

@PieceOptions({
    name: 'plugins',
    description: 'View and modify plugins for this application',
    preconditions: ['CachedGuild'],
})
export class Help extends Command {
    async chatInputRun(
        interaction: Command.ChatInputCommandInteraction<'cached'>
    ) {
        const client = interaction.client as Client<true>;
        let guildData = await client.guildData.fetch(interaction.guildId);

        interaction.reply({
            embeds: [createSettingsEmbed(interaction, guildData)],
            components: createSettingsComponents(guildData),
            ephemeral: true,
        });
    }
}
