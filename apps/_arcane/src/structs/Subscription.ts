import {
    AudioPlayer,
    AudioPlayerPlayingState,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    entersState,
    getVoiceConnection,
    joinVoiceChannel,
    NoSubscriberBehavior,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ClientEvents,
    Events,
    GuildTextBasedChannel,
    MessageActionRowComponentBuilder,
    StringSelectMenuBuilder,
    VoiceBasedChannel,
} from 'discord.js';
import yts from 'yt-search';
import { Client } from '../client/client.js';
import { SubscriptionMessageManager } from '../managers/SubscriptionMessageManager.js';
import { SubscriptionVoteManager } from '../managers/SubscriptionVoteManager.js';
import { Track } from '../structs/Track.js';

// ! fix message/playing mismatch when songs are added quickly

export namespace Subscription {
    export interface Playable<Metadata = unknown> {
        // add message manager to track as well
        updateInteraction?(
            interaction: ChatInputCommandInteraction<'cached'>
        ): void;
        createAudioResource(): Promise<AudioResource<Metadata>>;
    }

    export type AudioPlayerWithPlayingState = AudioPlayer & {
        state: AudioPlayerPlayingState & { resource: AudioResource<Track> };
    };

    export type VideoLike = yts.VideoSearchResult | yts.VideoMetadataResult;
}

export class Subscription {
    readonly player: AudioPlayer;
    readonly messages: SubscriptionMessageManager;
    readonly votes: SubscriptionVoteManager;
    public queue: Track[];
    public history: Track[];
    public queueLock: boolean;
    public loop: boolean;
    public pointer = 0;
    readonly voteStop: Set<string>;

    constructor(
        readonly client: Client<true>,
        readonly text: GuildTextBasedChannel,
        readonly voice: VoiceBasedChannel
    ) {
        this.queueLock = false;
        this.loop = false;
        this.queue = [];
        this.history = [];
        this.voteStop = new Set();
        this.votes = new SubscriptionVoteManager(this);
        this.messages = new SubscriptionMessageManager(this);

        const connection =
            getVoiceConnection(voice.guildId) ??
            joinVoiceChannel({
                channelId: voice.id,
                guildId: voice.guildId,
                adapterCreator: voice.guild.voiceAdapterCreator,
                selfDeaf: true,
            })
                .on(VoiceConnectionStatus.Disconnected, async () => {
                    try {
                        await Promise.race([
                            entersState(
                                connection,
                                VoiceConnectionStatus.Signalling,
                                5_000
                            ),
                            entersState(
                                connection,
                                VoiceConnectionStatus.Connecting,
                                5_000
                            ),
                        ]);
                    } catch {
                        if (
                            connection.state.status !==
                            VoiceConnectionStatus.Destroyed
                        )
                            connection.destroy();
                    }
                })
                .on(VoiceConnectionStatus.Destroyed, () => this.destroy());

        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        })
            .on(AudioPlayerStatus.Idle, async (oldState) => {
                if (oldState.status === AudioPlayerStatus.Idle) return;

                this.votes.skip.clear();
                this.votes.stop.clear();

                const track = (oldState.resource as AudioResource<Track>)
                    .metadata;

                this.loop && this.queue.push(track);
                await this.messages.delete();
                await this.processQueue();
            })
            .on(AudioPlayerStatus.Playing, (oldState, newState) => {
                const track = (newState.resource as AudioResource<Track>)
                    .metadata;

                if (oldState.status !== AudioPlayerStatus.Playing)
                    this.messages.create(track);
            })
            .on('error', (error) => {
                console.error('AudioPlayer error:', error);
                this.processQueue();
            });

        connection.subscribe(this.player);
    }

    get voters() {
        return this.voice.members.filter((member) => !member.user.bot);
    }

    get neededVotes() {
        return ~~(this.voters.size / 2);
    }

    get guild() {
        return this.voice.guild;
    }

    get guildId() {
        return this.guild.id;
    }

    get playing(): Track | null {
        return this.isPlaying() ? this.player.state.resource.metadata : null;
    }

    shuffleQueue() {
        for (let i = 0; i < this.queue.length; i++) {
            const j = ~~(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }

        return this.queue;
    }

    isPlaying(): this is this & {
        readonly player: Subscription.AudioPlayerWithPlayingState;
        get playing(): Track;
    } {
        return this.player.state.status === AudioPlayerStatus.Playing;
    }

    createMessageComponents() {
        const buttons = [
            new ButtonBuilder()
                .setCustomId('PAUSE')
                .setLabel(
                    this.player.state.status === AudioPlayerStatus.Playing
                        ? 'Pause'
                        : 'Play'
                )
                .setStyle(
                    this.player.state.status === AudioPlayerStatus.Paused
                        ? ButtonStyle.Success
                        : ButtonStyle.Primary
                ),
            new ButtonBuilder()
                .setCustomId('SKIP')
                .setLabel(
                    this.votes.skip.size > 0
                        ? `Skip・${this.votes.skip.size}/${this.votes.neededVotes}`
                        : 'Skip'
                )
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('LOOP')
                .setLabel(this.loop ? 'Loop off' : 'Loop on')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('STOP')
                .setLabel(
                    this.votes.stop.size > 0
                        ? `Stop・${this.votes.stop.size}/${this.votes.neededVotes}`
                        : 'Stop'
                )
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('DISCONNECT')
                .setLabel(
                    this.votes.disconnect.size > 0
                        ? `Disconnect・${this.votes.disconnect.size}/${this.votes.neededVotes}`
                        : 'Disconnect'
                )
                .setStyle(ButtonStyle.Danger),
        ];

        const buttonRow =
            new ActionRowBuilder<MessageActionRowComponentBuilder>({
                components: buttons,
            });

        const queueRow = new ActionRowBuilder<MessageActionRowComponentBuilder>(
            {
                components: [
                    new StringSelectMenuBuilder()
                        .setCustomId('QUEUE')
                        .setPlaceholder(`Queue・${this.queue.length}`)
                        .setOptions(
                            this.queue.map((track) => ({
                                label: track.video.title.slice(0, 100),
                                value: track.id,
                            }))
                        )
                        .setDisabled(true),
                ],
            }
        );

        return this.queue.length > 0 ? [buttonRow, queueRow] : [buttonRow];
    }

    async enqueue(...tracks: Track[]) {
        this.queue.push(...tracks);

        await this.processQueue();
        await this.messages.patch();
    }

    dequeue(...tracks: Track[]) {
        for (const track of tracks) {
            const index = this.queue.indexOf(track);

            index > -1 && this.queue.splice(index, 1);
        }

        this.messages.patch();
    }

    stop(destroy = false) {
        this.queueLock = true;
        this.queue.length = 0;
        this.player.stop(true);

        destroy && getVoiceConnection(this.guildId)?.destroy();
    }

    destroy() {
        this.client.subscriptions.delete(this.guildId);
    }

    onVoiceStateUpdate(...[oldState]: ClientEvents[Events.VoiceStateUpdate]) {
        if (
            this.voice.id === oldState.channel?.id &&
            oldState.channel.members.size === 1
        )
            return this.stop(true);

        this.votes.processVotes();
    }

    private async processQueue(): Promise<void> {
        if (
            this.queueLock ||
            this.player.state.status !== AudioPlayerStatus.Idle ||
            this.queue.length === 0
        )
            return;

        const nextTrack = this.queue.shift()!;

        try {
            const resource = await nextTrack.createAudioResource();

            this.player.play(resource);

            await entersState(this.player, AudioPlayerStatus.Playing, 5_000);
        } catch (error) {
            console.error(
                Error('Error while attempting to play track', { cause: error })
            );

            this.processQueue();
        } finally {
            this.queueLock = false;
        }
    }
}
