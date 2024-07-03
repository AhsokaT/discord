import { Command } from '@sapphire/framework';
import { PieceOptions } from '../util/util.js';
import { EmbedBuilder } from 'discord.js';

@PieceOptions({
    name: 'statsfornerds',
    description: 'Stats for nerds',
})
export class Stats extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const reply = await interaction.deferReply({
            ephemeral: true,
            fetchReply: true,
        });

        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

        const embed = new EmbedBuilder()
            .setTitle(`Stats for nerds`)
            .setColor('#2B2D31')
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL({
                    size: 4096,
                }),
            })
            .addFields(
                {
                    name: 'Websocket heartbeat',
                    value: `${interaction.client.ws.ping}ms`,
                    inline: true,
                },
                {
                    name: 'Client latency',
                    value: `${ping}ms`,
                    inline: true,
                },
                {
                    name: 'Ready since',
                    value: `<t:${~~(
                        interaction.client.readyTimestamp / 1000
                    )}:f> <t:${~~(
                        interaction.client.readyTimestamp / 1000
                    )}:R>`,
                    inline: true,
                },
                {
                    name: 'Memory usage',
                    value: `${memoryUsage.toFixed(2)}MB`,
                    inline: true,
                },
                {
                    name: 'Node.js',
                    value: process.version,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true,
                }
            );

        interaction.editReply({ embeds: [embed] });
    }
}
