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
};

export const HOUSE_INFO = new Command()
    .addIdentifiers('HOUSEINFO')
    .onButton(async interaction => {
        const client = interaction.client as Client;
        const pointManager = client.housePointManager;
        const house = interaction.customId.split('_').pop();

        if (!house)
            return void interaction.deferUpdate().catch(console.debug);

        const cachedMembers = interaction.guild.members.cache.filter(member => member.roles.cache.has(RoleID[house]));

        let position = pointManager.sorted.map(([name]) => name).indexOf(house);

        let houses = pointManager.sorted.filter(([_, points]) => points === pointManager.sorted[position]![1]).sort((a, b) => b[1] - a[1]);

        position = pointManager.sorted.map(([name]) => name).indexOf(houses[0][0]);

        const value = houses.length > 1 ? `Joint **${Ordinal[position + 1]}** with ${houses.filter(([name]) => name !== house).map(([name]) => `<@&${RoleID[name]}>`).join(', ')}` : `**${Ordinal[position + 1]}** with **${pointManager.points[house]} points**`;

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle(House[house])
            .setDescription(`<@&${RoleID[house]}> ${HouseDescription[house]}`)
            .addFields({
                name: 'Position on leaderboard',
                value,
                inline: true
            });

        if (cachedMembers.size > 0)
            embed.addFields({
                name: 'Cached members',
                value: [...cachedMembers.values()].join(' '),
                inline: true
            });

        interaction.reply({ embeds: [embed], ephemeral: true, allowedMentions: { parse: [] } }).catch(console.debug);
    });