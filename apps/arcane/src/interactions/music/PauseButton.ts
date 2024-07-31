import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class PauseButton extends MusicInteractionHandler {
    async run(
        interaction: ButtonInteraction,
        subscription: InteractionHandler.ParseResult<this>
    ) {
        subscription.player[subscription.isPlaying() ? 'pause' : 'unpause'](true);

        await interaction.update({
            components: subscription.createMessageComponents(),
        });
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId === 'PAUSE'
            ? super.parse(interaction)
            : this.none();
    }
}
