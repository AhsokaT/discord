import { ActionRowBuilder, MessageActionRowComponentBuilder, ButtonInteraction } from 'discord.js';
import { InteractionHandler, InteractionHandlerTypes, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { DeleteInteractionButton, allPointChangeEmbed } from '../util/builders';
import { HousePoints } from '../database/DatabaseManager';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button
})
export class ViewChanges extends InteractionHandler {
    run(interaction: ButtonInteraction) {
        let [_, json] = interaction.customId.split('_');

        const changes = JSON.parse(json);

        const before = Object.keys(changes).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][0] }), {} as HousePoints);
        const after = Object.keys(changes).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][1] }), {} as HousePoints);

        interaction.reply({
            embeds: [
                allPointChangeEmbed(before, after, interaction.user)
            ],
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(DeleteInteractionButton())
            ],
            allowedMentions: { parse: [] }
        }).catch(console.debug);
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId.startsWith('P') ? this.some() : this.none();
    }
}

container.stores.loadPiece({
    piece: ViewChanges,
    name: ViewChanges.name,
    store: 'interaction-handlers'
});