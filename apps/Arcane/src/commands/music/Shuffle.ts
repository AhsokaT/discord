import { Command } from '@sapphire/framework';
import { PieceOptions } from '../../util/util.js';
import { MusicCommand } from '../../structs/MusicCommand.js';
import { Subscription } from '../../structs/Subscription.js';

@PieceOptions({
    name: 'shuffle',
    description: 'Shuffle the queue',
    preconditions: ['VoiceChannelLock'],
})
export class Remove extends MusicCommand {
    async run(
        interaction: Command.ChatInputCommandInteraction<'cached'>,
        subscription: Subscription
    ) {
        for (let i = 0; i < subscription.queue.length; i++) {
            const j = ~~(Math.random() * (i + 1));
            [subscription.queue[i], subscription.queue[j]] = [subscription.queue[j], subscription.queue[i]];
        }

        subscription.messages.patch();

        interaction.reply({ content: 'I have shuffled the queue!', ephemeral: true });
    }
}
