import {
    ChatInputCommandErrorPayload,
    Events,
    Listener,
} from '@sapphire/framework';

export class ChatInputCommandError extends Listener<
    typeof Events.ChatInputCommandError
> {
    async run(error: unknown, payload: ChatInputCommandErrorPayload) {
        if (payload.interaction.deferred || payload.interaction.replied)
            await payload.interaction.editReply(
                'Sorry, an unknown error occured'
            );
        else
            await payload.interaction.reply({
                content: 'Sorry, an unknown error occured',
                ephemeral: true,
            });
    }
}
