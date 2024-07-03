import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Autocomplete })
export class RemoveAutocomplete extends MusicInteractionHandler {
    constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Autocomplete
        });
    }

    async run(interaction: AutocompleteInteraction, subscription: InteractionHandler.ParseResult<this>) {
        const options = subscription.queue.map(track => ({ name: track.video.title, value: track.id }));
        interaction.respond(options).catch(console.error);
    }

    parse(interaction: AutocompleteInteraction) {
        return interaction.commandName === 'remove' ? super.parse(interaction) : this.none();
    }
}