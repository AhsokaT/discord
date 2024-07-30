import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class RemoveButton extends MusicInteractionHandler {
    async run(
        interaction: ButtonInteraction,
        subscription: InteractionHandler.ParseResult<this>
    ) {
        const [, ...idComponents] = interaction.customId.split('_');
        const id = idComponents.join('_');
        const video = subscription.queue.find((i) => i.id === id);

        if (!video)
            return interaction.update({
                content: 'video is not in the queue >~<!',
                components: [],
            });

        subscription.dequeue(video);

        await interaction.update({
            components: video.createMessageComponents(),
        });
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('REMOVE')
            ? super.parse(interaction)
            : this.none();
    }
}
