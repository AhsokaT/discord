import { Command } from '@sapphire/framework';
import { PieceOptions } from '../../util/util.js';

@PieceOptions({
    name: 'Disconnect',
    description: 'Disconnect the bot from the voice channel',
    preconditions: ['VoiceChannelLock'],
})
export class Disconnect extends Command {
    async chatInputRun(
        interaction: Command.ChatInputCommandInteraction<'cached'>
    ) {
        const subscription = interaction.client.subscriptions.get(
            interaction.guildId
        );

        if (!subscription)
            return interaction.reply({
                content: "there's nothing playing, dumbass (ー_ー)!!",
                ephemeral: true,
            });

        const passed = subscription.votes.castDisconnect(interaction.user.id);

        !passed && subscription.messages.patch();

        interaction
            .reply({
                content: passed ? 'Disconnecting' : 'Vote cast',
                ephemeral: true,
            })
            .catch(console.error);
    }
}
