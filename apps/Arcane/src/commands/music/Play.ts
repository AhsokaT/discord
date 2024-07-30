import { Command } from '@sapphire/framework';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Subscription } from '../../structs/Subscription.js';
import { Track } from '../../structs/Track.js';
import ytdl from '@distube/ytdl-core';
import { PieceOptions } from '../../util/util.js';
import { PluginBits } from '../../util/PluginBitField.js';
import yts from 'yt-search';

@PieceOptions({
    name: 'play',
    description: 'Stream audio to a voice channel',
    requiredClientPermissions: [
        PermissionFlagsBits.Speak,
        PermissionFlagsBits.DeafenMembers,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
    ],
    preconditions: ['VoiceConnectionRequired'],
})
export class Play extends Command {
    async chatInputRun(
        interaction: Command.ChatInputCommandInteraction<'cached'>
    ) {
        await interaction.deferReply({ ephemeral: true });
        const client = interaction.client;
        const me = interaction.guild.members.me;
        const voice = interaction.member.voice.channel;
        const query = interaction.options.getString('query', true);

        if (!voice)
            return interaction.editReply('join a voice voice (ー_ー)!!');

        if (!voice.joinable || voice.id === voice.guild.afkChannelId)
            return interaction.editReply(
                `uh oh ㅠㅅㅠ I can't join your voice voice`
            );

        if (!interaction.channel)
            return interaction.editReply(
                `uh oh ㅠㅅㅠ I can't send messages in this channel`
            );

        const subscription =
            client.subscriptions.get(interaction.guildId) ??
            new Subscription(client, interaction.channel, voice);

        client.subscriptions.set(interaction.guildId, subscription);

        if (me?.permissions.has(PermissionFlagsBits.DeafenMembers))
            await me.voice.setDeaf(true);

        let video: Subscription.VideoLike | null = null;

        const idResolvable = ytdl.validateID(query) || ytdl.validateURL(query);

        // ! add better error handling
        if (idResolvable) {
            let id: string;

            try {
                id = ytdl.getVideoID(query);
            } catch {
                return interaction.editReply(
                    `Could not parse ID from \` ${query} \``
                );
            }

            video = client.videoCache.get(id) ?? (await yts({ videoId: id }));
        } else {
            try {
                const result = await yts({ query });

                const [first] = result.videos;

                if (first) video = first;
            } catch {
                return interaction.editReply(
                    `I couldn't find the video you were looking for (ー_ー)!!`
                );
            }
        }

        if (video == null)
            return interaction.editReply(
                `I couldn't find the video you were looking for (ー_ー)!!`
            );

        client.videoCache.set(video.videoId, video);

        if (client.videoCache.size > 1000)
            client.videoCache.delete(client.videoCache.keys().next().value);

        const track = new Track(subscription, video, interaction.user);
        const inQueue = subscription.queue.some((queued) =>
            queued.equals(track)
        );

        if (inQueue)
            return interaction.editReply(
                'video is already in the queue >~<!'
            );

        await subscription.enqueue(track);

        await interaction.editReply(track.toAddedString());
    }

    static readonly builder = new SlashCommandBuilder()
        .setName('play')
        .setDescription('Stream audio to a voice voice')
        .addStringOption((option) =>
            option.setName('query').setDescription('Some description')
        );

    static readonly plugin = PluginBits.Music;
}
