import { ButtonInteraction } from 'discord.js';
import { InteractionHandler, InteractionHandlerTypes, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button
})
export class HouseInfo extends InteractionHandler {
    async run(interaction: ButtonInteraction) {
        interaction.reply({
            ephemeral: true,
            content: 'This button does nothing yet!'
        }).catch(console.warn);
    }

    parse(interaction: ButtonInteraction) {
        return /^HOUSEINFO/.test(interaction.customId) ? this.some() : this.none();
    }
}

container.stores.loadPiece({
    piece: HouseInfo,
    name: HouseInfo.name,
    store: 'interaction-handlers'
});