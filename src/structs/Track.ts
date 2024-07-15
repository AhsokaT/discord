import { createAudioResource, demuxProbe } from '@discordjs/voice';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    MessageActionRowComponentBuilder,
    User,
} from 'discord.js';
import ytdl from '@distube/ytdl-core';
import { Subscription } from '../structs/Subscription.js';
import { toOrdinal } from '../util/util.js';

interface EmbedOptions {
    label?: string;
    relativeDuration?: boolean;
    paused?: boolean;
    commandId?: string;
    channelId?: string;
}

export class Track implements Subscription.Playable<Track> {
    constructor(
        readonly subscription: Subscription,
        readonly video: Subscription.VideoLike,
        readonly author: User
    ) {}

    get index() {
        return this.subscription.queue.indexOf(this);
    }

    get thumbnail() {
        return `https://img.youtube.com/vi/${this.id}/maxresdefault.jpg`;
    }

    get id() {
        return this.video.videoId;
    }

    toAddedString() {
        if (this.index === -1)
            return `${this} added.\n-# Video will begin playing shortly.`;

        let waitStr = '';
        const before = this.subscription.queue.slice(0, this.index);
        const wait = before.reduce((acc, curr) => acc + curr.video.seconds, 0);
        /** Start time using the Discord epoch (I think). */
        const timeStart = ~~((new Date().getTime() + wait * 1000) / 1000);

        if (wait > 0)
            waitStr = ` and will begin playing at <t:${timeStart}:t><t:${timeStart}:R>`;

        return `${this} added.\n-# Video is ${toOrdinal(
            this.index + 1
        )} in the queue${waitStr}.`;
    }

    toDurationString() {
        const str = new Date(this.video.seconds * 1000)
            .toISOString()
            .slice(11, 19);

        return str.startsWith('00:') ? str.slice(3) : str;
    }

    equals(other: Track) {
        return this.id === other.id;
    }

    async createAudioResource() {
        const audio = ytdl(this.video.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
        }).on('error', (error) => {
            console.error('ytdl error:', error);
            try {
                console.debug('attempting to resume...');
                audio.resume();
            } catch {
                console.debug('destroying audio...');
                audio.destroy();
            }
        });

        const { stream, type } = await demuxProbe(audio);

        return createAudioResource(stream, { inputType: type, metadata: this });
    }

    createMessageOptions() {
        return {
            embeds: [this.createEmbed()],
            components: this.createMessageComponents(),
        };
    }

    createMessageComponents() {
        const actionRow =
            new ActionRowBuilder<MessageActionRowComponentBuilder>();

        const index = this.subscription.queue.indexOf(this);

        if (index === -1)
            return [
                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ADD_${this.id}`)
                        .setLabel('Add to queue')
                        .setStyle(ButtonStyle.Primary)
                ),
            ];

        index > 0 &&
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`NEXT_${this.id}`)
                    .setLabel('Play next')
                    .setStyle(ButtonStyle.Primary)
            );

        this.subscription.queue.at(-1)?.equals(this) ||
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`LAST_${this.id}`)
                    .setLabel('Play last')
                    .setStyle(ButtonStyle.Primary)
            );

        actionRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`REMOVE_${this.id}`)
                .setLabel('Remove from queue')
                .setStyle(ButtonStyle.Danger)
        );

        return [actionRow];
    }

    createEmbed(options?: EmbedOptions) {
        const timeFinish = new Date().getTime() + this.video.seconds * 1000;

        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setImage(this.thumbnail)
            .setAuthor({
                name: this.author.username,
                iconURL: this.author.displayAvatarURL(),
            })
            .addFields(
                {
                    name: options?.label ?? 'Video',
                    value: `> ${this.toString().slice(0, 1022)}`,
                },
                {
                    name: 'Finishes',
                    value: `<t:${Math.round(
                        timeFinish / 1000
                    )}:t> <t:${Math.round(timeFinish / 1000)}:R>`,
                }
            );

        if (
            'createdAt' in this.video &&
            typeof this.video.createdAt === 'string'
        ) {
            const createdTimestamp = Date.parse(this.video.createdAt);

            embed.addFields({
                name: 'Published',
                value: `<t:${Math.round(
                    createdTimestamp / 1000
                )}:f> <t:${Math.round(createdTimestamp / 1000)}:R>`,
            });
        }

        if (options?.commandId && options.channelId)
            embed.setDescription(
                String.raw`</play:${options.commandId}> <#${options.channelId}>`
            );

        return embed;
    }

    toString() {
        const title = String.raw`${this.video.title}`;
        const url = `<https://youtu.be/${this.id}>` as const;
        return `[${title}](${url})` as const;
    }
}
