import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, container } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, StringSelectMenuInteraction } from 'discord.js';
import { House } from '../util/enum.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class HousePicker extends InteractionHandler {
    run(interaction: StringSelectMenuInteraction<'cached'>) {
        const [selection] = interaction.values;
        const house = House[selection as House.id];
    
        if (!selection) {
            console.debug('Select Menu Interaction did not include values');
            return void interaction.reply({ ephemeral: true, content: 'There was an error with your selection' }).catch(console.debug);
        }

        if (interaction.member.roles.cache.hasAny(...House.ALL.map(house => house.roleId)) && interaction.member.user.id !== '451448994128723978')
            return void interaction.reply({ content: 'You cannot join another house', ephemeral: true }).catch(console.debug);

        interaction.reply({
            ephemeral: true,
            content: `Are you sure you want to join **${house.name}** <@&${house.roleId}>? Once you join, you cannot change your house`,
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel('I\'m not sure yet')
                            .setCustomId(`HOUSEUNSURE`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('Sign me up!')
                            .setCustomId(`HOUSECONFIRM_${selection}`)
                    )
            ]
        }).catch(console.debug);
    }

    parse(interaction: StringSelectMenuInteraction) {
        return interaction.customId.startsWith('HOUSE') && interaction.inCachedGuild() ? this.some() : this.none();
    }
}

container.stores.loadPiece({
    piece: HousePicker,
    name: HousePicker.name,
    store: 'interaction-handlers'
});