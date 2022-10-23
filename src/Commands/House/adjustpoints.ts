import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { Client } from '../../client';
import { sendToLogChannel } from '../../misc';
import { HouseInfoButton, UserInfoButton } from '../builders';
import { Command } from '../template';
import { House, RoleID } from './house';
import { HouseParticipants } from './HousePointManager';

function houseOption(name: string) {
    return { name: House[name], value: name };
}

const ADJUST_POINTS = new SlashCommandBuilder()
    .setName('adjustpoints')
    .setDescription('Adjust house points')
    .addStringOption(option => option
        .setName('house')
        .setDescription('House to assign points to')
        .addChoices(...Object.keys(House).map(houseOption))
        .setRequired(true)
    )
    .addIntegerOption(option => option
        .setName('points')
        .setDescription('The number of points to assign')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Reason for point adjustment')
        .setRequired(true)
    );

export const ADJUST_POINTS_COMMAND = new Command()
    .addIdentifiers('adjustpoints')
    .addGuilds('509135025560616963')
    .addBuilders(ADJUST_POINTS)
    .onChatInputCommand(async interaction => {
        const house = interaction.options.getString('house', true) as HouseParticipants;
        const points = interaction.options.getInteger('points', true);
        const reason = interaction.options.getString('reason', true);

        if (points === 0)
            return void interaction.reply({ content: 'What do you expect me to do with zero points?', ephemeral: true }).catch(console.debug);

        await interaction.deferReply({ ephemeral: true }).catch(console.debug);

        (interaction.client as Client).housePointManager.adjustPoints(house, points);

        const content = points < 0 ? `**${points * -1} points removed** from <@&${RoleID[house]}>\n\`• Reason\` ${reason}` : `**${points} points added** to <@&${RoleID[house]}>\n\`• Reason\` ${reason}`;

        sendToLogChannel(interaction.client as Client, {
            content,
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    UserInfoButton(interaction.user.id, `${points < 0 ? 'Removed' : 'Added'} by`),
                    HouseInfoButton(house)
                )
            ],
            allowedMentions: { parse: [] }
        })
            .then(log => interaction.editReply({
                content: points < 0 ? `:confused: Removed **${points * -1} points** from **${House[house]}** <@&${RoleID[house]}>` : `:partying_face: Added **${points} points** to **${House[house]}** <@&${RoleID[house]}>`,
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        new ButtonBuilder()
                            .setLabel('Log')
                            .setStyle(ButtonStyle.Link)
                            .setURL(log.url)
                    )
                ],
                allowedMentions: { parse: [] }
            }))
            .catch(console.debug);
    });