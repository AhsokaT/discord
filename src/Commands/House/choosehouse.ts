import { ActionRowBuilder, SlashCommandBuilder, MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Command } from '../template';
import { House, HouseEmoji, RoleID } from './housePicker';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('choosehouse')
    .setDescription('Choose your house!');

export const HOUSES = new Command()
    .addIdentifiers('choosehouse', 'CHOOSEHOUSE', 'HOUSEUNSURE2')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
        if (interaction.member.roles.cache.hasAny(RoleID.TIGER, RoleID.OWL, RoleID.RAVEN, RoleID.TURTLE, RoleID.PANDA))
            return void interaction.reply({ content: 'You have already joined a house!', ephemeral: true });

        const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        const buttons = ['Tiger', 'Owl', 'Raven', 'Turtle', 'Panda'].map(house => house.toUpperCase()).map(house =>
            new ButtonBuilder()
                .setCustomId(`CHOOSEHOUSE_${house}`)
                .setLabel(House[house])
                .setStyle(ButtonStyle.Primary)
                .setEmoji(HouseEmoji[house])
        );

        actionRow.addComponents(buttons);

        interaction.reply({ content: 'Choose your house below!', components: [actionRow], ephemeral: true });
    })
    .onButton(interaction => {
        if (interaction.customId.startsWith('CHOOSEHOUSE')) {
            const house = interaction.customId.split('_').pop() as keyof typeof House;
            const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

            actionRow.addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('I\'m not sure yet')
                    .setCustomId(`HOUSEUNSURE2`),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Sign me up!')
                    .setCustomId(`HOUSECONFIRM_${house}`)
            );

            interaction.update({
                content: `You can only join a house once, are you sure you want to join **${House[house]}** <@&${RoleID[house]}>?`,
                components: [actionRow]
            });
        } else if (interaction.customId === 'HOUSEUNSURE2') {
            const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

            const buttons = ['TIGER', 'OWL', 'RAVEN', 'TURTLE', 'PANDA'].map(house =>
                new ButtonBuilder()
                    .setCustomId(`CHOOSEHOUSE_${house}`)
                    .setLabel(House[house])
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(HouseEmoji[house])
            );

            actionRow.addComponents(buttons);

            interaction.update({
                content: 'Choose your house below!',
                components: [actionRow]
            });
        }
    });