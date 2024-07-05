import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../util/util.js';
import { Track } from '../structs/Track.js';
import yts from 'yt-search';
import { Subscription } from '../structs/Subscription.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class AddVideoButton extends MusicInteractionHandler {
    async run(interaction: ButtonInteraction, subscription: InteractionHandler.ParseResult<this>) {
        const [, ...idComponents] = interaction.customId.split('_');
    
        const id = idComponents.join('_');

        let video: Subscription.VideoLike;

        try {
            video = await yts({ videoId: id });
        } catch {
            return void interaction.update({ content: 'video not found >~<!', components: [] }).catch(console.error);
        }

        const track = new Track(subscription, video, interaction.user);

        subscription.enqueue(track);

        interaction.update({ components: track.createMessageComponents() }).catch(console.error);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('ADD') ? super.parse(interaction) : this.none();
    }
}