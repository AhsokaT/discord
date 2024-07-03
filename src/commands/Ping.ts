import { Command } from '@sapphire/framework';
import { PieceOptions } from '../util/util.js';
import { EmbedBuilder } from 'discord.js';

@PieceOptions({
    name: 'ping',
    description: 'Ping pong!',
})
export class Ping extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const reply = await interaction.deferReply({
            ephemeral: true,
            fetchReply: true,
        });

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setTitle(`:ping_pong: **Pong!**`)
            .setColor(`#2B2D31`)
            .addFields(
                {
                    name: `Websocket heartbeat`,
                    value: `${interaction.client.ws.ping}ms`,
                    inline: true,
                },
                {
                    name: `Client latency`,
                    value: `${ping}ms`,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true,
                },
                {
                    name: `What is a heartbeat?`,
                    value: `The time taken for a signal to reach Discord and for Discord to respond`,
                },
                {
                    name: `What is latency?`,
                    value: `The time taken for the client to recieve and respond to your commands`,
                }
            );

        interaction.editReply({ embeds: [embed] });
    }
}
