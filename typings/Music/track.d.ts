import { AudioResource } from '@discordjs/voice';
import { Subscription } from './subscription';
import { ActionRowBuilder, Message, GuildMember, MessageActionRowComponentBuilder } from 'discord.js';
interface VideoData {
    url: string;
    loopOnce?: boolean;
    title: string;
}
export declare class Track implements Required<VideoData> {
    readonly subscription: Subscription;
    readonly url: string;
    readonly title: string;
    readonly addedBy: GuildMember;
    messages: Message[];
    loopOnce: boolean;
    static from(url: string, subscription: Subscription, addedBy: GuildMember): Promise<Track>;
    private constructor();
    get queueActions(): ActionRowBuilder<MessageActionRowComponentBuilder>;
    onStart(): Promise<void>;
    onEnqueue(): Promise<void>;
    onFinish(): void;
    onError(error: any): void;
    createAudioResource(): Promise<AudioResource<Track>>;
    toString(): string;
}
export {};
