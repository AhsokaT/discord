import {
    ChatInputCommandErrorPayload,
    Events,
    Listener,
} from '@sapphire/framework';

export class ChatInputCommandError extends Listener<
    typeof Events.ChatInputCommandError
> {
    run(error: unknown, payload: ChatInputCommandErrorPayload) {
        if (payload.interaction.deferred || payload.interaction.replied)
            payload.interaction
                .editReply('Sorry, an unknown error occured')
                .catch(console.error);
        else
            payload.interaction
                .reply({
                    content: 'Sorry, an unknown error occured',
                    ephemeral: true,
                })
                .catch(console.error);
    }
}
