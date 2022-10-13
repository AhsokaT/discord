import { EmbedBuilder } from 'discord.js';
import { Client } from '../../client';
import { Command } from '../template';
import { House, HouseDescription, RoleID } from './house';

const Ordinal = {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: '4th',
    5: '5th'
}

export const HOUSE_INFO = new Command()
    .addIdentifiers('HOUSEINFO')
    .onButton(interaction => {
        const client = interaction.client as Client;
        const house = interaction.customId.split('_').pop();

        if (!house)
            return void interaction.deferUpdate().catch(console.debug);

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle(House[house])
            .setDescription(HouseDescription[house])
            .addFields(
                {
                    name: 'Approximate member count',
                    value: `${interaction.guild.members.cache.filter(member => member.roles.cache.has(RoleID[house])).size} <@&${RoleID[house]}>`,
                    inline: true
                },
                {
                    name: 'Position on leaderboard',
                    value: `**${Ordinal[client.housePointManager.sorted.map(([name]) => name).indexOf(House[house]) + 1]}** with **${client.housePointManager.points[house]} points**`,
                    inline: true
                }
            );

        interaction.reply({ embeds: [embed], ephemeral: true, allowedMentions: { parse: [] } }).catch(console.debug);
    });