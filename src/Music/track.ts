import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice';
import { Subscription } from './subscription';
import { ActionRowBuilder, ButtonBuilder, Message, GuildMember, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import { raw as ytdl } from 'youtube-dl-exec';
import { getBasicInfo } from 'ytdl-core';

interface VideoData {
    url: string;
    loopOnce?: boolean;
    title: string;
}

interface TrackOptions extends VideoData {
	subscription: Subscription;
    addedBy: GuildMember;
}

export class Track implements Required<VideoData> {
	readonly subscription: Subscription;
	readonly url: string;
	readonly title: string;
    readonly addedBy: GuildMember;

	public messages: Message[] = [];
	public loopOnce: boolean;

	static async from(url: string, subscription: Subscription, addedBy: GuildMember): Promise<Track> {
        const info = await getBasicInfo(url);

		return new Track({ url, subscription, addedBy, title: info.videoDetails.title });
	}

	private constructor({ url, title, loopOnce = false, subscription, addedBy }: TrackOptions) {
		this.url = url;
		this.title = title;
		this.loopOnce = loopOnce;
		this.subscription = subscription;
        this.addedBy = addedBy;
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
		if (this.loopOnce) {
			this.loopOnce = false;
			this.subscription.enqueue(this);
		}

		if (this.subscription.loop)
			this.subscription.enqueue(this);
	}

	onError(error: any): void {
		console.warn(`Track error: ${error}`);
	}

	createAudioResource(): Promise<AudioResource<Track>> {
		return new Promise((resolve, reject) => {
			const process = ytdl(
				this.url, {
					o: '-',
					q: '',
					f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
					r: '100K'
				},
				{
					stdio: ['ignore', 'pipe', 'ignore']
				}
			);

			if (!process.stdout) {
				reject(Error('No stdout'));
                return;
            }

			const stream = process.stdout;

			function onError(error: any) {
				if (!process.killed)
					process.kill();

				stream.resume();
				reject(error);
			}

			process
				.once('spawn', () => {
					demuxProbe(stream)
						.then(probe => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
						.catch(onError);
				})
				.catch(onError);
		});
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