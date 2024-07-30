import { Command } from '@sapphire/framework';
import { MusicCommand } from '../../structs/MusicCommand.js';
import { Subscription } from '../../structs/Subscription.js';
import { PieceOptions } from '../../util/util.js';

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
        const id = interaction.user.id;
        const voted = subscription.voteStop.has(id);

        subscription.voteStop[voted ? 'delete' : 'add'](id);

        if (subscription.voteStop.size >= subscription.votes.neededVotes) {
            subscription.stop();
            subscription.voteStop.clear();
            interaction.reply({ content: 'Stopping', ephemeral: true });
        } else {
            interaction.reply({
                content: voted ? 'Removed vote' : 'Cast vote',
                ephemeral: true,
            });
        }
    }
}
