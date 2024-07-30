import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class TrackShiftButtons extends MusicInteractionHandler {
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

        subscription.queue.splice(video.index, 1);

        subscription.queue[
            interaction.customId.startsWith('LAST') ? 'push' : 'unshift'
        ](video);

        await interaction.update({
            components: video.createMessageComponents(),
        });

        await subscription.messages.patch();
    }

    parse(interaction: ButtonInteraction) {
        return ['LAST', 'FIRST'].some((i) => interaction.customId.startsWith(i))
            ? super.parse(interaction)
            : this.none();
    }
}
