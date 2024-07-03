import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class TrackShiftButtons extends MusicInteractionHandler {
    async run(interaction: ButtonInteraction, subscription: InteractionHandler.ParseResult<this>) {
        const [, ...idComponents] = interaction.customId.split('_');
    
        const id = idComponents.join('_');
    
        const video = subscription.queue.find(i => i.id === id);
    
        if (!video)
            return void interaction.update({ content: 'video is not in the queue >~<!', components: [] }).catch(console.error);
    
        subscription.queue.splice(subscription.queue.indexOf(video), 1);
    
        subscription.queue = interaction.customId.startsWith('LAST') ? [...subscription.queue, video] : [video, ...subscription.queue];
    
        interaction.update({ components: video.createMessageComponents() }).catch(console.error);

        subscription.messages.patch();
    }

    parse(interaction: ButtonInteraction) {
        return /^(LAST|NEXT)/.test(interaction.customId) ? super.parse(interaction) : this.none();
    }
}