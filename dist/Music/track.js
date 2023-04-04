"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
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
    async createAudioResource() {
        const { stream, type } = await (0, voice_1.demuxProbe)((0, ytdl_core_1.default)(this.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }));
        return (0, voice_1.createAudioResource)(stream, { inputType: type, metadata: this });
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
