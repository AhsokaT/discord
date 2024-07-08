import yts from 'yt-search';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import { PieceOptions } from '../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Autocomplete })
export class PlayAutocomplete extends InteractionHandler {
    async run(interaction: AutocompleteInteraction) {
        return void interaction.respond([]);

        // const query = interaction.options.getFocused();

        // if (!query)
        //     return interaction.respond([]).catch(console.error);

        // if (interaction.inCachedGuild() && !interaction.member?.voice.channel)
        //     return interaction.respond([]).catch(console.error);

        // let results: yts.SearchResult;
        
        // try {
        //     results = await yts({ query });
        // } catch {
        //     return interaction.respond([]).catch(console.error);
        // }

        // const options = results.videos
        //     .slice(0, 25)
        //     .map(video => ({ name: video.title, value: video.videoId }));

        // interaction.respond(options).catch(console.error);
    }

    parse(interaction: AutocompleteInteraction) {
        return interaction.commandName === 'play' ? this.some() : this.none();
    }
}