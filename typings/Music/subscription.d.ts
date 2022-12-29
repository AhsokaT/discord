import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { VoiceChannel, Guild, Message, ButtonInteraction, ChatInputCommandInteraction, MessageActionRowComponentBuilder, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import { Track } from './track';
import { Client } from '../client';
export declare class Subscription {
    readonly client: Client;
    readonly guild: Guild;
    readonly connection: VoiceConnection;
    readonly interaction: ChatInputCommandInteraction<'cached'>;
    readonly voice: VoiceChannel;
    readonly player: AudioPlayer;
    queue: Track[];
    loop: boolean;
    queueLock: boolean;
    readyLock: boolean;
    nowPlayingMessage: Message<true> | null;
    nowPlaying: Track | null;
    constructor(client: Client, guild: Guild, connection: VoiceConnection, interaction: ChatInputCommandInteraction<'cached'>, voice: VoiceChannel);
    private checkMemberCount;
    enqueue(track: Track, position?: 'next' | 'last'): void;
    skip(): void;
    stop(leave?: boolean): void;
    private processQueue;
    buildNowPlayingMessage(track: Track): {
        content: string;
        embeds: EmbedBuilder[];
        components: ActionRowBuilder<MessageActionRowComponentBuilder>[];
        allowedMentions: {
            parse: never[];
        };
    };
    listenForInteraction(message: Message): import("discord.js").InteractionCollector<import("discord.js").StringSelectMenuInteraction<import("discord.js").CacheType> | import("discord.js").UserSelectMenuInteraction<import("discord.js").CacheType> | import("discord.js").RoleSelectMenuInteraction<import("discord.js").CacheType> | import("discord.js").MentionableSelectMenuInteraction<import("discord.js").CacheType> | import("discord.js").ChannelSelectMenuInteraction<import("discord.js").CacheType> | ButtonInteraction<import("discord.js").CacheType>>;
    private onInteraction;
}
