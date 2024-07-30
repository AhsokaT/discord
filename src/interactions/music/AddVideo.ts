import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import yts from 'yt-search';
import { Subscription } from '../../structs/Subscription.js';
import { Track } from '../../structs/Track.js';
import { MusicInteractionHandler, PieceOptions } from '../../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class AddVideoButton extends MusicInteractionHandler {
    async run(
        interaction: ButtonInteraction,
        subscription: InteractionHandler.ParseResult<this>
    ) {
        const [, ...idComponents] = interaction.customId.split('_');
        const videoId = idComponents.join('_');

        let video: Subscription.VideoLike;

        try {
            video = await yts({ videoId });
        } catch {
            return interaction.update({
                content: 'video not found >~<!',
                components: [],
            });
        }

        const track = new Track(subscription, video, interaction.user);

        await subscription.enqueue(track);

        await interaction.update({
            components: track.createMessageComponents(),
        });
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('ADD')
            ? super.parse(interaction)
            : this.none();
    }
}
