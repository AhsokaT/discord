import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class DisconnectButton extends MusicInteractionHandler {
    async run(interaction: ButtonInteraction, subscription: InteractionHandler.ParseResult<this>) {
        const passed = subscription.votes.castDisconnect(interaction.user.id);

        passed || interaction.update({ components: subscription.createMessageComponents() }).catch(console.error);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId === 'DISCONNECT' ? super.parse(interaction) : this.none();
    }
}