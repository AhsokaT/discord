import {
    ChatInputCommandDeniedPayload,
    Events,
    Listener,
    UserError,
} from '@sapphire/framework';

export class ChatInputCommandDenied extends Listener<
    typeof Events.ChatInputCommandDenied
> {
    run(error: UserError, payload: ChatInputCommandDeniedPayload) {
        if (payload.interaction.deferred || payload.interaction.replied)
            payload.interaction
                .editReply({
                    content: error.message,
                    components: [],
                    embeds: [],
                })
                .catch(console.error);
        else
            payload.interaction
                .reply({ content: error.message, ephemeral: true })
                .catch(console.error);
    }
}
