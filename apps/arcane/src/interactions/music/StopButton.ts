import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class StopButton extends MusicInteractionHandler {
    async run(
        interaction: ButtonInteraction,
        subscription: InteractionHandler.ParseResult<this>
    ) {
        const id = interaction.user.id;
        const voted = subscription.voteStop.has(id);

        subscription.voteStop[voted ? 'delete' : 'add'](id);

        if (subscription.voteStop.size >= subscription.votes.neededVotes) {
            subscription.stop();
            subscription.voteStop.clear();
            await interaction.reply({ content: 'Stopping', ephemeral: true });
        } else {
            await interaction.reply({
                content: voted ? 'Removed vote' : 'Cast vote',
                ephemeral: true,
            });
        }
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId === 'STOP'
            ? super.parse(interaction)
            : this.none();
    }
}
