import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

// ! this does not work if paused
@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class SkipButton extends MusicInteractionHandler {
    async run(interaction: ButtonInteraction, subscription: InteractionHandler.ParseResult<this>) {
        const passed = subscription.votes.castSkip(interaction.user.id);

        !passed && interaction.update({ components: subscription.createMessageComponents() }).catch(console.error);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId === 'SKIP' ? super.parse(interaction) : this.none();
    }
}