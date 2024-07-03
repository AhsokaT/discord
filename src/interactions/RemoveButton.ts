import { ButtonInteraction } from 'discord.js';
import { MusicInteractionHandler, PieceOptions } from '../util/util.js';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Button })
export class RemoveButton extends MusicInteractionHandler {
    run(interaction: ButtonInteraction, subscription: InteractionHandler.ParseResult<this>) {
        const [, ...idComponents] = interaction.customId.split('_');

        const id = idComponents.join('_');
    
        const video = subscription.queue.find(i => i.id === id);
    
        if (!video)
            return void interaction.update({ content: 'video is not in the queue >~<!', components: [] }).catch(console.error);
    
        subscription.dequeue(video);
    
        interaction.update({ components: video.createMessageComponents() }).catch(console.error);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('REMOVE') ? super.parse(interaction) : this.none();
    }
}