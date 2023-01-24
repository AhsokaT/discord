import { ActionRowBuilder, MessageActionRowComponentBuilder } from '@discordjs/builders';
import { allPointChangeEmbed, DeleteInteractionButton } from './builders';
import { HousePoints } from './House/HousePointManager';
import { Command } from './template';

export const POINT_CHANGE = new Command()
    .addIdentifiers('P')
    .addGuilds('509135025560616963')
    .onButton(interaction => {
        let [_, json] = interaction.customId.split('_');

        const changes = JSON.parse(json);

        const before = Object.keys(changes).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][0] }), {} as HousePoints);
        const after = Object.keys(changes).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][1] }), {} as HousePoints);

        interaction.reply({
            embeds: [
                allPointChangeEmbed(before, after)
            ],
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(DeleteInteractionButton())
            ],
            allowedMentions: { parse: [] }
        }).catch(console.debug);
    });