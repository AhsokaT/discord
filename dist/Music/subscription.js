"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const util_1 = require("util");
const wait = (0, util_1.promisify)(setTimeout);
class Subscription {
    client;
    guild;
    connection;
    interaction;
    voice;
    player;
    queue = [];
    loop = false;
    queueLock = false;
    readyLock = false;
    nowPlayingMessage = null;
    nowPlaying = null;
    constructor(client, guild, connection, interaction, voice) {
        this.client = client;
        this.guild = guild;
        this.connection = connection;
        this.interaction = interaction;
        this.voice = voice;
        this.connection = connection;
        this.interaction = interaction;
        this.voice = voice;
        this.player = (0, voice_1.createAudioPlayer)({ debug: true });
        this.connection.on('stateChange', async (_, newState) => {
            if (newState.status === voice_1.VoiceConnectionStatus.Disconnected) {
                if (newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    await (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Connecting, 5000).catch(this.connection.destroy);
                }
                else if (this.connection.rejoinAttempts < 5) {
                    await wait((this.connection.rejoinAttempts + 1) * 5000);
                    this.connection.rejoin();
                }
                else {
                    this.connection.destroy();
                }
            }
            else if (newState.status === voice_1.VoiceConnectionStatus.Destroyed) {
                this.stop();
                try {
                    client.subscriptions.delete(this.guild.id);
                }
                catch (err) {
                    console.warn(err);
                }
            }
            else if (!this.readyLock &&
                (newState.status === voice_1.VoiceConnectionStatus.Connecting || newState.status === voice_1.VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Ready, 20_000);
                }
                catch {
                    if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed)
                        this.connection.destroy();
                }
                finally {
                    this.readyLock = false;
                }
            }
        });
        this.player.on('stateChange', (oldState, newState) => {
            if (newState.status === voice_1.AudioPlayerStatus.Idle && oldState.status !== voice_1.AudioPlayerStatus.Idle) {
                oldState.resource.metadata.onFinish();
                void this.processQueue();
            }
            else if (newState.status === voice_1.AudioPlayerStatus.Playing) {
                newState.resource.metadata.onStart().catch(console.warn);
            }
        });
        this.player.on('error', error => error.resource.metadata.onError(error));
        connection.subscribe(this.player);
        this.checkMemberCount();
    }
    async checkMemberCount() {
        let channel;
        try {
            channel = await this.voice.fetch();
        }
        catch (err) {
            return console.warn(err);
        }
        if (channel.members.size < 2 && this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
            return this.stop(true);
        }
        setTimeout(() => this.checkMemberCount(), 15_000);
    }
    enqueue(track) {
        this.queue.push(...track);
        if (this.player.state.status === voice_1.AudioPlayerStatus.Playing && this.interaction.replied && this.nowPlaying && this.nowPlayingMessage)
            this.nowPlayingMessage.edit(this.buildNowPlayingMessage(this.nowPlaying)).catch(console.warn);
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
    async processQueue() {
        if (this.queueLock || this.player.state.status !== voice_1.AudioPlayerStatus.Idle || this.queue.length === 0)
            return;
        this.queueLock = true;
        const nextTrack = this.queue.shift();
        try {
            const resource = await nextTrack.createAudioResource();
            this.player.play(resource);
            if (!this.nowPlayingMessage) {
                let message = await this.interaction.editReply(this.buildNowPlayingMessage(nextTrack));
                this.listenForInteraction(message);
                this.nowPlayingMessage = message;
            }
            else {
                this.nowPlayingMessage.edit(this.buildNowPlayingMessage(nextTrack));
            }
        }
        catch (error) {
            nextTrack.onError(error);
            return this.processQueue();
        }
        finally {
            this.queueLock = false;
            this.nowPlaying = nextTrack;
        }
    }
    buildNowPlayingMessage(track) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#DD2E44')
            .setFooter({ text: `🔁 Loop ${this.loop ? 'on' : 'off'}` })
            .setDescription(this.voice.toString())
            .addFields({
            name: 'Now playing',
            value: `**[${track.toString().split('').map(char => ['`', '*', '_', '~', '|', '>'].includes(char) ? '\\' + char : char).join('')}](${track.url})**`
        })
            .setAuthor({ name: track.addedBy.user.tag, iconURL: track.addedBy.displayAvatarURL({ size: 4096 }) });
        const actionRow1 = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('skip')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setLabel('Skip'), new discord_js_1.ButtonBuilder()
            .setCustomId('loop')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setLabel('Loop'), new discord_js_1.ButtonBuilder()
            .setCustomId('shuffle')
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setLabel('Shuffle')
            .setDisabled(this.queue.length <= 1), new discord_js_1.ButtonBuilder()
            .setCustomId('stop')
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setLabel('Stop'));
        const actionRow2 = new discord_js_1.ActionRowBuilder();
        if (this.queue.length > 0) {
            let options = this.queue.map(track => new discord_js_1.StringSelectMenuOptionBuilder().setLabel(track.toString()).setValue(track.url)).slice(0, 25);
            actionRow2.addComponents(new discord_js_1.StringSelectMenuBuilder().addOptions(options).setCustomId('QUEUE').setPlaceholder('Up next'));
        }
        return {
            content: '',
            embeds: [embed],
            components: actionRow2.components.length > 0 ? [actionRow1, actionRow2] : [actionRow1],
            allowedMentions: { parse: [] }
        };
    }
    listenForInteraction(message) {
        return message.createMessageComponentCollector().on('collect', i => this.onInteraction(i));
    }
    async onInteraction(interaction) {
        if (!interaction.inCachedGuild())
            return void interaction.reply({ ephemeral: true, content: ':x: Guild not cached' }).catch(console.warn);
        // if (interaction.member.voice.channelId !== interaction.guild.me?.voice.channelId)
        //     return void interaction.reply({ ephemeral: true, content: ':x: You are not in the same voice channel me' }).catch(console.warn);
        switch (interaction.customId) {
            // Now playing options
            case 'loop':
                this.loop = !this.loop;
                interaction.update(this.buildNowPlayingMessage(this.nowPlaying)).catch(console.warn);
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
                interaction.update(this.buildNowPlayingMessage(this.nowPlaying)).catch(console.warn);
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
                    message.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button }).on('collect', interaction => {
                        if (interaction.customId === 'remove') {
                            this.queue = this.queue.filter(({ url }) => url !== track.url);
                            interaction.update({ content: `Removed [${track}](<${track.url}>) from the queue`, components: [] });
                        }
                        else if (interaction.customId === 'playlast') {
                            this.queue = [...this.queue.filter(({ url }) => url !== track.url), track];
                            interaction.update({
                                content: `[${track}](<${track.url}>) is number ${this.queue.findIndex(({ url }) => url === track.url) + 1} in the queue`,
                                components: [track.queueActions]
                            });
                        }
                        else if (interaction.customId === 'playnext') {
                            this.queue = [track, ...this.queue.filter(({ url }) => url !== track.url)];
                            interaction.update({
                                content: `[${track}](<${track.url}>) is number ${this.queue.findIndex(({ url }) => url === track.url) + 1} in the queue`,
                                components: [track.queueActions]
                            });
                        }
                        if (this.nowPlayingMessage && this.nowPlaying)
                            this.nowPlayingMessage.edit(this.buildNowPlayingMessage(this.nowPlaying));
                    });
                }
                catch (err) {
                    console.warn(err);
                }
                break;
            // End
        }
    }
}
exports.Subscription = Subscription;
