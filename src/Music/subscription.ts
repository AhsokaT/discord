import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus
} from '@discordjs/voice';
import { VoiceChannel, Guild, Message, ComponentType, ButtonInteraction, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageComponentInteraction } from 'discord.js';
import { Track } from './track';
import { promisify } from 'util';
import { Client } from '../client';

const wait = promisify(setTimeout);

export class Subscription {
    readonly player: AudioPlayer;
    public queue: Track[] = [];
    public loop = false;
	public queueLock = false;
	public readyLock = false;
    public nowPlayingMessage: Message<true> | null = null;
    public nowPlaying: Track | null = null;

    constructor(
        readonly client: Client,
        readonly guild: Guild,
        readonly connection: VoiceConnection,
        readonly interaction: ChatInputCommandInteraction<'cached'>,
        readonly voice: VoiceChannel
    ) {
        this.connection = connection;
        this.interaction = interaction;
        this.voice = voice;
        this.player = createAudioPlayer({ debug: true });

        this.connection.on('stateChange', async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    await entersState(this.connection, VoiceConnectionStatus.Connecting, 5000).catch(this.connection.destroy);
                } else if (this.connection.rejoinAttempts < 5) {
                    await wait((this.connection.rejoinAttempts + 1) * 5000);
                    this.connection.rejoin();
                } else {
                    this.connection.destroy();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.stop();

                try {
                    client.subscriptions.delete(this.guild.id);
                } catch(err) {
                    console.warn(err);
                }
            } else if (
                !this.readyLock &&
                (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
            ) {
                this.readyLock = true;
 
                try {
                    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.connection.state.status !== VoiceConnectionStatus.Destroyed)
                        this.connection.destroy();
                } finally {
                    this.readyLock = false;
                }
            }
        });

        this.player.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                (oldState.resource as AudioResource<Track>).metadata.onFinish();
                void this.processQueue();
            } else if (newState.status === AudioPlayerStatus.Playing) {
                (newState.resource as AudioResource<Track>).metadata.onStart().catch(console.warn);
            }

            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle || newState.status === AudioPlayerStatus.Playing)
                this.queue.forEach(track => {
                    for (let i = 0; i < track.messages.length; i++) {
                        track.messages[i].delete().catch(console.warn);

                        track.messages.splice(i, 1);
                    }
                });
        });

		this.player.on('error', error => (error.resource as AudioResource<Track>).metadata.onError(error));

		connection.subscribe(this.player);

        this.checkMemberCount();
    }

    private async checkMemberCount() {
        let channel: VoiceChannel;

        try {
            channel = await this.voice.fetch();
        } catch {
            console.warn('stopping with reason: err');
            return this.stop(true);
        }

        if (channel.members.size < 2 && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            console.warn('stopping with reason: empty channel');
            return this.stop(true);
        }

        setTimeout(() => this.checkMemberCount(), 15_000);
    }

	enqueue(track: Track, position: 'next' | 'last' = 'last') {
        if (position === 'last')
            this.queue.push(track);
        else
            this.queue = [track, ...this.queue];

        if (this.player.state.status === AudioPlayerStatus.Playing) {
            track.onEnqueue().catch(console.warn);

            if (this.interaction.replied && this.nowPlaying && this.nowPlayingMessage)
                this.nowPlayingMessage.edit(this.buildNowPlayingMessage(this.nowPlaying)).catch(console.warn);
        }

		void this.processQueue();
	}

    skip() {
        this.player.stop();
    }

	stop(leave = false) {
		this.queueLock = true;
		this.queue = [];
		this.player.stop(true);

        if (leave) {
            this.connection.destroy();
            this.client.subscriptions.delete(this.guild.id);

            if (this.nowPlayingMessage)
                this.nowPlayingMessage.delete().catch(console.warn);
        }
	}

	private async processQueue(): Promise<void> {
		if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0)
            return;

		this.queueLock = true;

		const nextTrack = this.queue.shift()!

		try {
			const resource = await nextTrack.createAudioResource();
			this.player.play(resource);

            if (!this.nowPlayingMessage) {
                let message = await this.interaction.editReply(this.buildNowPlayingMessage(nextTrack));

                this.listenForInteraction(message);
                this.nowPlayingMessage = message;
            } else {
                this.nowPlayingMessage.edit(this.buildNowPlayingMessage(nextTrack));
            }
		} catch (error) {
			nextTrack.onError(error);

			return this.processQueue();
		} finally {
            this.queueLock = false;
            this.nowPlaying = nextTrack;
        }
	}

    buildNowPlayingMessage(track: Track) {
        const embed = new EmbedBuilder()
            .setColor('#DD2E44')
            .setFooter({ text: `🔁 Loop ${this.loop ? 'on' : 'off'}` })
            .setDescription(this.voice.toString())
            .addFields({
                name: 'Now playing',
                value: `**[${track.toString().split('').map(char => ['`', '*', '_', '~', '|', '>'].includes(char) ? '\\' + char : char).join('')}](${track.url})**`
            })
            .setAuthor({ name: track.addedBy.user.tag, iconURL: track.addedBy.displayAvatarURL({ size: 4096 }) });

        const actionRow1 = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('skip')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Skip'),
            new ButtonBuilder()
                .setCustomId('loop')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Loop'),
            new ButtonBuilder()
                .setCustomId('shuffle')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Shuffle')
                .setDisabled(this.queue.length === 0),
            new ButtonBuilder()
                .setCustomId('stop')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Stop')
        );

        const actionRow2 = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        if (this.queue.length > 0) {
            let options = this.queue.map(track => new StringSelectMenuOptionBuilder().setLabel(track.toString()).setValue(track.url));

            actionRow2.addComponents(new StringSelectMenuBuilder().addOptions(options).setCustomId('QUEUE').setPlaceholder('Up next'));
        }

        return {
            content: '',
            embeds: [embed],
            components: actionRow2.components.length > 0 ? [actionRow1, actionRow2] : [actionRow1],
            allowedMentions: { parse: [] }
        };
    }

    listenForInteraction(message: Message) {
        return message.createMessageComponentCollector().on('collect', i => this.onInteraction(i));
    }

    private async onInteraction(interaction: MessageComponentInteraction): Promise<void> {
        if (!interaction.inCachedGuild())
            return void interaction.reply({ ephemeral: true, content: ':x: Guild not cached' }).catch(console.warn);

        // if (interaction.member.voice.channelId !== interaction.guild.me?.voice.channelId)
        //     return void interaction.reply({ ephemeral: true, content: ':x: You are not in the same voice channel me' }).catch(console.warn);

        switch (interaction.customId) {
            // Now playing options
            case 'loop':
                this.loop = !this.loop;

                interaction.update(this.buildNowPlayingMessage(this.nowPlaying!)).catch(console.warn);
                break;

            case 'skip':
                this.skip();

                interaction.deferUpdate().catch(console.warn);
                
                if (this.queue.length === 0 && this.nowPlayingMessage)
                    this.nowPlayingMessage.delete().catch(console.warn);
                break;

            case 'stop':
                this.stop(true);
                break;

            case 'shuffle':
                if (this.queue.length < 2) {
                    interaction.reply({ ephemeral: true, content: ':x: Queue is not **sufficiently long** to shuffle' }).catch(console.warn);
                    break;
                }

                for (let i = this.queue.length - 1; i > 0; i--) {
                    const randomIndex = Math.floor(Math.random() * (i + 1));

                    const element = this.queue[i];

                    this.queue[i] = this.queue[randomIndex];
                    this.queue[randomIndex] = element;
                }

                interaction.update(this.buildNowPlayingMessage(this.nowPlaying!)).catch(console.warn);
                break;

            case 'QUEUE':
                if (!interaction.isStringSelectMenu())
                    return;

                const track = this.queue.find(track => track.url === interaction.values[0]);

                if (!track)
                    return void interaction.reply({ ephemeral: true, content: ':x: Track not found' }).catch(console.warn);

                try {
                    const message = await interaction.reply({
                        ephemeral: true,
                        content: `[${track}](<${track.url}>) is number ${this.queue.findIndex(({ url }) => url === track.url) + 1} in the queue :violin:`,
                        components: [track.queueActions],
                        fetchReply: true
                    });

                    message.createMessageComponentCollector({ componentType: ComponentType.Button }).on('collect', interaction => {
                        if (interaction.customId === 'remove') {
                            this.queue = this.queue.filter(({ url }) => url !== track.url);

                            interaction.update({ content: `Removed [${track}](<${track.url}>) from the queue`, components: [] });
                        } else if (interaction.customId === 'playlast') {
                            this.queue = [...this.queue.filter(({ url }) => url !== track.url), track];

                            interaction.update({
                                content: `[${track}](<${track.url}>) is number ${this.queue.findIndex(({ url }) => url === track.url) + 1} in the queue`,
                                components: [track.queueActions]
                            });
                        } else if (interaction.customId === 'playnext') {
                            this.queue = [track, ...this.queue.filter(({ url }) => url !== track.url)];

                            interaction.update({
                                content: `[${track}](<${track.url}>) is number ${this.queue.findIndex(({ url }) => url === track.url) + 1} in the queue`,
                                components: [track.queueActions]
                            });
                        }

                        if (this.nowPlayingMessage && this.nowPlaying)
                            this.nowPlayingMessage.edit(this.buildNowPlayingMessage(this.nowPlaying));
                    });
                } catch(err) {
                    console.warn(err);
                }

                break;
            // End
        }
    }
}