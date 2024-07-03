import { Command } from '@sapphire/framework';
import { PieceOptions } from '../util/util.js';
import { MusicCommand } from '../music/MusicCommand.js';
import { Subscription } from '../music/Subscription.js';

@PieceOptions({
    name: 'remove',
    description: 'Remove a song from the queue',
    preconditions: ['VoiceChannelLock'],
})
export class Remove extends MusicCommand {
    async run(
        interaction: Command.ChatInputCommandInteraction<'cached'>,
        subscription: Subscription
    ) {
        const songId = interaction.options.getString('song', true);
        const track = subscription.queue.find((track) => track.id === songId);

        if (track == null)
            return void interaction.reply({
                content: 'song not found',
                ephemeral: true,
            });

        subscription.dequeue(track);

        interaction.reply({ ...track.createMessageOptions(), ephemeral: true });
    }
}
