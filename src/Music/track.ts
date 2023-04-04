import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import { Subscription } from './subscription';
import { ActionRowBuilder, ButtonBuilder, GuildMember, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import { Video } from 'discord-youtube-api';
import ytdl from 'ytdl-core';

export class Track {
	constructor(
		readonly video: Video,
		readonly subscription: Subscription,
		readonly addedBy: GuildMember
	) {
		this.video = video;
		this.subscription = subscription;
        this.addedBy = addedBy;
	}

	get url() {
		return this.video.url;
	}

	get title() {
		return this.video.title;
	}

    get queueActions() {
        const playNext = new ButtonBuilder()
            .setCustomId('playnext')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Play Next')
            .setDisabled(this.subscription.queue[0] === this ? true : false);

        const playLast = new ButtonBuilder()
            .setCustomId('playlast')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Play Last')
            .setDisabled(this.subscription.queue[this.subscription.queue.length - 1] === this ? true : false);

        const remove = new ButtonBuilder()
            .setCustomId('remove')
            .setStyle(ButtonStyle.Danger)
            .setLabel('Remove')
            .setDisabled(!this.subscription.queue.includes(this));

        const link = new ButtonBuilder()
            .setLabel('Video')
            .setStyle(ButtonStyle.Link)
            .setURL(this.url);

        return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(playNext, playLast, remove, link);
    }

	async onStart(): Promise<void> {
        // if (this.channel) {
        //     try {
        //         this.subscription.nowPlayingMessage = await this.channel.send(this.buildNowPlayingMessage());
        //     } catch(err) {
        //         return console.warn(err);
        //     }

        //     this.listenForInteraction(this.subscription.nowPlayingMessage);
        // }
	}

	async onEnqueue(): Promise<void> {
        // let message: Message;

        // try {
        //     message = await this.channel.send({
        //         content: `**Enqueued** \` ${this} \` at position ${this.subscription.queue.indexOf(this) + 1} :notes:`,
        //         components: [ this.queueActions ]
        //     });
        // } catch {
        //     return;
        // }

        // this.messages.push(message);
        // this.listenForInteraction(message);
	}

	onFinish() {
		if (this.subscription.loop)
			this.subscription.enqueue([this]);
	}

	onError(error: any): void {
		console.warn(`Track error: ${error}`);
	}

	async createAudioResource(): Promise<AudioResource<Track>> {
		const { stream, type } = await demuxProbe(ytdl(this.url, {
			filter: 'audioonly',
			quality: 'highestaudio',
			highWaterMark: 1 << 25
		}));

		return createAudioResource(stream, { inputType: type, metadata: this });
	}

	toString() {
		return this.title ?? this.url;
	}
}

// function which takes numbers and returns the factorial of the number
// and product of all the numbers before it
function factorial(n: number): number {
    if (n === 0)
        return 1;

    return n * factorial(n - 1);
}