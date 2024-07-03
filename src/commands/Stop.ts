import { Command } from '@sapphire/framework';
import { PieceOptions } from '../util/util.js';
import { MusicCommand } from '../music/MusicCommand.js';
import { Subscription } from '../music/Subscription.js';

@PieceOptions({
    name: 'Stop',
    description: 'Will stop streaming audio but will remain in voice channel',
    preconditions: ['VoiceChannelLock'],
})
export class Stop extends MusicCommand {
    async run(
        interaction: Command.ChatInputCommandInteraction<'cached'>,
        subscription: Subscription
    ) {
        const passed = subscription.votes.castStop(interaction.user.id);

        if (!passed) subscription.messages.patch();

        interaction
            .reply({
                content: passed ? 'Stopping' : 'Vote cast',
                ephemeral: true,
            })
            .catch(console.error);
    }
}
