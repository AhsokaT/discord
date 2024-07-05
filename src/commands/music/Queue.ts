import { Command } from '@sapphire/framework';
import {
    ActionRowBuilder,
    EmbedBuilder,
    MessageActionRowComponentBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { MusicCommand } from '../../structs/MusicCommand.js';
import { Subscription } from '../../structs/Subscription.js';
import { PieceOptions } from '../../util/util.js';

@PieceOptions({
    name: 'queue',
    description: 'YouTube URL or search query',
    preconditions: ['VoiceChannelLock'],
})
export class Queue extends MusicCommand {
    async run(
        interaction: Command.ChatInputCommandInteraction<'cached'>,
        subscription: Subscription
    ) {
        if (subscription.queue.length === 0)
            return void interaction.reply({
                content: 'the queue is empty >~<!!',
                ephemeral: true,
            });

        const seconds = subscription.queue
            .map((track) => track.video.duration.seconds)
            .reduce((acc, curr) => acc + curr, 0);

        let timeString = new Date(seconds * 1000).toISOString().slice(11, 19);

        if (timeString.startsWith('00:')) timeString = timeString.slice(3);

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle(interaction.guild.name)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL(),
            });

        if (subscription.isPlaying())
            embed.addFields({
                name: 'Now playing',
                value: `> ${subscription.player.state.resource.metadata}`,
            });

        let fieldValue = '';
        let fieldCount = 1;

        subscription.queue.forEach((track, index) => {
            const trackString = `> \` ${index + 1} \` ${track}\n`; // Format the track string
            if ((fieldValue.length + trackString.length) > 1024) { // Check if adding the next track exceeds 1024 characters
                // Add the current field to the embed
                embed.addFields({ name: `Up next`, value: fieldValue });
                fieldValue = trackString; // Start a new field value with the current track
                fieldCount++; // Increment the part counter
            } else {
                fieldValue += trackString; // Add the track to the current field value
            }
        });

        // Add the last field to the embed if it's not empty
        if (fieldValue) {
            embed.addFields({ name: `Up next`, value: fieldValue });
        }

        embed.addFields(
            // {
            //     name: 'Up next',
            //     value: subscription.queue
            //         .map((track, index) => `> \` ${index + 1} \` ${track}`)
            //         .join('\n'),
            // },
            {
                name: 'Time',
                value: timeString,
            }
        );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('QUEUE')
            .setPlaceholder(`Up next・1\u2013${subscription.queue.length}`)
            .addOptions(
                subscription.queue.map((track) => ({
                    label: track.video.title,
                    value: track.id,
                }))
            )
            .setDisabled(true);

        interaction
            .reply({
                embeds: [embed],
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>({
                        components: [selectMenu],
                    }),
                ],
                ephemeral: true,
                allowedMentions: { parse: [] },
            })
            .catch(console.error);
    }
}
