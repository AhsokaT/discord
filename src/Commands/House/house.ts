import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import { Command } from '../template';

export enum House {
    TIGER = '🐯 House of Tiger',
    OWL = '🦉 100 Acre Wood',
    RAVEN = '👁️ The Ravens',
    TURTLE = '🐢 Kame House',
    PANDA = '🐼 Bamboo Forest'
}

export enum RoleID {
    TIGER = '1024014286416261191',
    OWL = '1024014430448660490',
    RAVEN = '1024014477789773965',
    TURTLE = '1024014510723432478',
    PANDA = '1024014614536667239'
}

export const HOUSE_COMMAND = new Command()
    .addIdentifiers('HOUSE', 'HOUSECONFIRM')
    .onButton(async interaction => {
        if (!interaction.customId.startsWith('HOUSECONFIRM'))
            return;

        const selection = interaction.customId.split('_').pop();

        if (!selection)
            return console.error('Selection not included in custom ID');

        try {
            await interaction.update({
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel('Sign me up!')
                                .setCustomId(`HOUSECONFIRM_${selection}`)
                                .setDisabled(true)
                        )
                ]
            });
        } catch (err) {
            return console.debug(err);
        }

        try {
            await interaction.member.roles.add(RoleID[selection]);
        } catch (err) {
            interaction.editReply({ content: ':x: There was an error assigning your house, try again later', components: [] }).catch(console.debug);

            return console.error(err);
        }

        interaction.editReply({ content: `You have successfully joined **${House[selection]}**`, components: []}).catch(console.debug);
    })
    .onSelectMenu(interaction => {
        const [selection] = interaction.values;

        if (!selection) {
            console.debug('Select Menu Interaction did not include values');
            return void interaction.reply({ ephemeral: true, content: 'There was an error with your selection' }).catch(console.debug);
        }

        if (interaction.member.roles.cache.hasAny(...Object.values(RoleID)))
            return void interaction.reply({ content: 'You cannot join another house', ephemeral: true }).catch(console.debug);

        interaction.reply({
            ephemeral: true,
            content: `Are you sure you want to join **${House[selection]}**? You can dismiss this message if you want to reconsider`,
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('Sign me up!')
                            .setCustomId(`HOUSECONFIRM_${selection}`)
                    )
            ]
        }).catch(console.debug);
    });