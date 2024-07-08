import { Command } from '@sapphire/framework';
import { PieceOptions } from '../../util/util.js';
import { MusicCommand } from '../../structs/MusicCommand.js';
import { Subscription } from '../../structs/Subscription.js';

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
                content: 'track not found',
                ephemeral: true,
            });

        subscription.dequeue(track);

        interaction.reply({ ...track.createMessageOptions(), ephemeral: true });
    }
}
