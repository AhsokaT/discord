import { AudioPlayerStatus, entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, MentionableSelectMenuBuilder, MessageActionRowComponentBuilder, PermissionFlagsBits, RoleSelectMenuBuilder, SlashCommandBuilder, UserSelectMenuBuilder } from 'discord.js';
import { validateURL } from 'ytdl-core';
import { Client } from '../client';
import { Subscription } from '../Music/subscription';
import { Track } from '../Music/track';
import { Command } from './template';

const PLAY_SLASH_COMMAND = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Stream music')
    .setDefaultMemberPermissions(PermissionFlagsBits.Speak)
    .addStringOption(option => option
        .setName('track')
        .setDescription('URL or search query')
        .setRequired(true)
    );

export const PLAY = new Command()
    .addIdentifiers('play')
    .addBuilders(PLAY_SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async interaction => {
        const voice = interaction.member.voice.channel;
        const client = interaction.client as Client;

        if (!voice)
            return void interaction.reply({ content: '❌ You are not in a voice channel', ephemeral: true }).catch(console.warn);

        if (!voice.joinable)
            return void interaction.reply({ content: `❌ I do not have permission to connect ${voice}`, ephemeral: true }).catch(console.warn);

        // if (!interaction.guild.me.permissions.has('SPEAK'))
        //     return void interaction.reply({ content: `❌ I do not have permission to speak in ${voice}`, ephemeral: true }).catch(console.warn);

        if (voice.type !== ChannelType.GuildVoice)
            return void interaction.reply({ content: ':x: Sorry, I don\'t currently support stage channels', ephemeral: true }).catch(console.warn);

        let subscription = client.subscriptions.get(interaction.guildId);

        let createdSubscription = false;

        if (!subscription) {
            subscription = new Subscription(
                client,
                interaction.guild,
                joinVoiceChannel({
                    channelId: voice.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                    selfDeaf: true
                }),
                interaction,
                voice
            );

            subscription.connection.on('error', console.warn);
            client.subscriptions.set(interaction.guildId, subscription);
            createdSubscription = true;
        }

        try {
            await entersState(subscription.connection, VoiceConnectionStatus.Ready, 20e3);
        } catch(err) {
            console.warn(err);

            return interaction.reply({ ephemeral: true, content: 'I could not connect to your voice channel :(' }).catch(console.warn);
        }

        try {
            await interaction.deferReply({ ephemeral: !createdSubscription });
        } catch {
            return;
        }

        const input = interaction.options.getString('track', true);

        let url: string | null = null;

        if (validateURL(input)) {
            url = input;
        } else {
            const search = await client.youtube.searchVideos(input, 1).catch(console.warn);

            if (search)
                url = search.url;
        }

        if (!url)
            return void interaction.editReply(':x: Search returned no videos').catch(console.warn);

        if (subscription.queue.find((video) => video.url === url))
            return void interaction.editReply('Track is already in the queue 🎶').catch(console.warn);

        try {
            const track = await Track.from(url, subscription, interaction.member);

            subscription.enqueue(track);

            if (!createdSubscription)
                interaction.editReply(`[${track}](<${url}>) is number ${subscription.queue.findIndex(track => track.url === url) + 1} in the queue`);
        } catch(err) {
            console.warn(err);
            interaction.editReply(':x: An error occurred whilst fetching the track').catch(console.warn);
        }
    });