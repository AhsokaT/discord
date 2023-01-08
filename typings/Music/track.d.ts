import { AudioResource } from '@discordjs/voice';
import { Subscription } from './subscription';
import { ActionRowBuilder, GuildMember, MessageActionRowComponentBuilder } from 'discord.js';
import { Video } from 'discord-youtube-api';
export declare class Track {
    readonly video: Video;
    readonly subscription: Subscription;
    readonly addedBy: GuildMember;
    constructor(video: Video, subscription: Subscription, addedBy: GuildMember);
    get url(): string;
    get title(): string;
    get queueActions(): ActionRowBuilder<MessageActionRowComponentBuilder>;
    onStart(): Promise<void>;
    onEnqueue(): Promise<void>;
    onFinish(): void;
    onError(error: any): void;
    createAudioResource(): Promise<AudioResource<Track>>;
    toString(): string;
}
