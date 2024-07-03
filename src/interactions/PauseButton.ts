import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { MusicInteractionHandler, PieceOptions } from '../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class PauseButton extends MusicInteractionHandler {
    async run(interaction: ButtonInteraction, subscription: InteractionHandler.ParseResult<this>) {
        if (subscription.player.state.status === AudioPlayerStatus.Playing)
            subscription.player.pause();
        else if (subscription.player.state.status === AudioPlayerStatus.Paused)
            subscription.player.unpause();

        interaction.update({ components: subscription.createMessageComponents() }).catch(console.error);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId === 'PAUSE' ? super.parse(interaction) : this.none();
    }
}