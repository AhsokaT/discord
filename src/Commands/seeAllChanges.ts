import { allPointChangeEmbed } from './builders';
import { House } from './House/housePicker';
import { HousePoints } from './House/HousePointManager';
import { Command } from './template';

export const POINT_CHANGE = new Command()
    .addIdentifiers('P')
    .addGuilds('509135025560616963')
    .onButton(interaction => {
        let [_, json] = interaction.customId.split('_');

        const changes = JSON.parse(json);

        const before = Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][0] }), {} as HousePoints);
        const after = Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: changes[h][1] }), {} as HousePoints);

        interaction.reply({
            ephemeral: true,
            embeds: [
                allPointChangeEmbed(before, after)
            ],
            allowedMentions: { parse: [] }
        }).catch(console.debug);
    });