import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import yts from 'yt-search';
import { PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Autocomplete })
export class PlayAutocomplete extends InteractionHandler {
    async run(interaction: AutocompleteInteraction) {
        const query = interaction.options.getFocused();

        if (!query) return interaction.respond([]);

        if (interaction.inCachedGuild() && !interaction.member?.voice.channel)
            return interaction.respond([]);

        let results: yts.SearchResult;

        try {
            results = await yts({ query });
        } catch {
            return interaction.respond([]);
        }

        const options = results.videos
            .slice(0, 25)
            .map((video) => ({ name: video.title, value: video.videoId }));

        await interaction.respond(options);
    }

    parse(interaction: AutocompleteInteraction) {
        return interaction.commandName === 'play' ? this.some() : this.none();
    }
}
