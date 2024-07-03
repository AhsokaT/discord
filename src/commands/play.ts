import { Command } from '@sapphire/framework';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Client } from '../client/client.js';
import { Subscription } from '../music/Subscription.js';
import { Track } from '../music/Track.js';
import ytdl from 'ytdl-core';
import { PieceOptions } from '../util/util.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { PluginBits } from '../util/PluginBitField.js';
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
        const client = interaction.client as Client<true>;
        const voice = interaction.member.voice.channel;
        const query = interaction.options.getString('query', true);

        if (!voice)
            return void interaction
                .reply({
                    content: 'join a voice voice (ー_ー)!!',
                    ephemeral: true,
                })
                .catch(console.warn);

        if (!voice.joinable || voice.id === voice.guild.afkChannelId)
            return void interaction
                .reply({
                    content: "uh oh ㅠㅅㅠ I can't join your voice voice",
                    ephemeral: true,
                })
                .catch(console.warn);

        if (!interaction.channel)
            return void interaction
                .reply({
                    content:
                        "uh oh ㅠㅅㅠ I can't send messages in this channel",
                    ephemeral: true,
                })
                .catch(console.warn);

        if (
            voice.guild.members.me?.permissions.has(
                PermissionFlagsBits.DeafenMembers
            )
        )
            voice.guild.members.me.voice.setDeaf(true).catch(console.warn);

        let subscription =
            client.subscriptions.get(interaction.guildId) ??
            new Subscription(client, interaction.channel, voice);

        client.subscriptions.set(interaction.guildId, subscription);

        const ephemeral =
            subscription.player.state.status !== AudioPlayerStatus.Idle;

        await interaction.deferReply({ ephemeral });

        let video: Subscription.VideoLike | null = null;

        try {
            const idOrUrl = ytdl.validateID(query) || ytdl.validateURL(query);

            if (idOrUrl) {
                const videoId = ytdl.getVideoID(query);

                video =
                    client.videoCache.get(query) ?? (await yts({ videoId }));
            } else {
                const result = await yts({ query });

                const [first] = result.videos;

                if (first) video = first;
            }
        } catch (error) {
            console.error(error);
        }

        if (video == null)
            return void interaction
                .reply({
                    content:
                        "I couldn't find the video you were looking for (ー_ー)!!",
                    ephemeral: true,
                })
                .catch(console.error);

        client.videoCache.set(video.videoId, video);

        if (client.videoCache.size > 1000)
            client.videoCache.delete(client.videoCache.keys().next().value);

        const track = new Track(
            subscription,
            video,
            interaction.user,
            interaction
        );

        if (
            subscription.queue.some((i) => i.equals(track)) ||
            subscription.playing?.equals(track)
        )
            return void interaction
                .reply({
                    content: 'video is already in the queue >~<!',
                    ephemeral: true,
                })
                .catch(console.error);

        if (subscription.player.state.status !== AudioPlayerStatus.Idle)
            await interaction.editReply(`${track} added`);

        subscription.enqueue(track);
    }

    static readonly builder = new SlashCommandBuilder()
        .setName('play')
        .setDescription('Stream audio to a voice voice')
        .addStringOption((option) =>
            option.setName('query').setDescription('Some description')
        );

    static readonly plugin = PluginBits.Music;
}
