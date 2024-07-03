import { Command } from '@sapphire/framework';
import { PieceOptions } from '../util/util.js';
import { MusicCommand } from '../music/MusicCommand.js';
import { Subscription } from '../music/Subscription.js';

@PieceOptions({
    name: 'Skip',
    description: 'Skip to the next track',
    preconditions: ['VoiceChannelLock'],
})
export class Skip extends MusicCommand {
    async run(
        interaction: Command.ChatInputCommandInteraction<'cached'>,
        subscription: Subscription
    ) {
        const passed = subscription.votes.castSkip(interaction.user.id);

        if (!passed) subscription.messages.patch();

        interaction
            .reply({
                content: passed ? 'Skipping' : 'Vote cast',
                ephemeral: true,
            })
            .catch(console.error);
    }
}
