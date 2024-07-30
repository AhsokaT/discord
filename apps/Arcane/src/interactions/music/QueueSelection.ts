import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { Interaction, StringSelectMenuInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.SelectMenu })
export class QueueSelection extends MusicInteractionHandler {
    async run(
        interaction: StringSelectMenuInteraction,
        subscription: InteractionHandler.ParseResult<this>
    ) {
        const [id] = interaction.values;
        const existing = subscription.queue.find((track) => track.id === id);

        if (!existing)
            return interaction.reply({
                content: 'video is not in the queue >~<!',
                ephemeral: true,
            });

        await interaction.reply({
            ...existing.createMessageOptions(),
            ephemeral: true,
        });

        await interaction.message.edit({
            components: subscription.createMessageComponents(),
        });
    }

    parse(interaction: Interaction) {
        return interaction.isStringSelectMenu() &&
            interaction.customId === 'QUEUE'
            ? super.parse(interaction)
            : this.none();
    }
}
