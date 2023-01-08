"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const youtube_dl_exec_1 = require("youtube-dl-exec");
class Track {
    video;
    subscription;
    addedBy;
    constructor(video, subscription, addedBy) {
        this.video = video;
        this.subscription = subscription;
        this.addedBy = addedBy;
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
        const playNext = new discord_js_1.ButtonBuilder()
            .setCustomId('playnext')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setLabel('Play Next')
            .setDisabled(this.subscription.queue[0] === this ? true : false);
        const playLast = new discord_js_1.ButtonBuilder()
            .setCustomId('playlast')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setLabel('Play Last')
            .setDisabled(this.subscription.queue[this.subscription.queue.length - 1] === this ? true : false);
        const remove = new discord_js_1.ButtonBuilder()
            .setCustomId('remove')
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setLabel('Remove')
            .setDisabled(!this.subscription.queue.includes(this));
        const link = new discord_js_1.ButtonBuilder()
            .setLabel('Video')
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setURL(this.url);
        return new discord_js_1.ActionRowBuilder().addComponents(playNext, playLast, remove, link);
    }
    async onStart() {
        // if (this.channel) {
        //     try {
        //         this.subscription.nowPlayingMessage = await this.channel.send(this.buildNowPlayingMessage());
        //     } catch(err) {
        //         return console.warn(err);
        //     }
        //     this.listenForInteraction(this.subscription.nowPlayingMessage);
        // }
    }
    async onEnqueue() {
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
    onError(error) {
        console.warn(`Track error: ${error}`);
    }
    createAudioResource() {
        return new Promise((resolve, reject) => {
            const process = (0, youtube_dl_exec_1.raw)(this.url, {
                o: '-',
                q: '',
                f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                r: '100K'
            }, {
                stdio: ['ignore', 'pipe', 'ignore']
            });
            if (!process.stdout) {
                reject(Error('No stdout'));
                return;
            }
            const stream = process.stdout;
            function onError(error) {
                if (!process.killed)
                    process.kill();
                stream.resume();
                reject(error);
            }
            process
                .once('spawn', () => {
                (0, voice_1.demuxProbe)(stream)
                    .then(probe => resolve((0, voice_1.createAudioResource)(probe.stream, { metadata: this, inputType: probe.type })))
                    .catch(onError);
            })
                .catch(onError);
        });
    }
    toString() {
        return this.title ?? this.url;
    }
}
exports.Track = Track;
// function which takes numbers and returns the factorial of the number
// and product of all the numbers before it
function factorial(n) {
    if (n === 0)
        return 1;
    return n * factorial(n - 1);
}
