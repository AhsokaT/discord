"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAY = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const ytdl_core_1 = require("ytdl-core");
const subscription_1 = require("../Music/subscription");
const track_1 = require("../Music/track");
const template_1 = require("./template");
const PLAY_SLASH_COMMAND = new discord_js_1.SlashCommandBuilder()
    .setName('play')
    .setName('test2')
    .setDescription('Stream music')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Speak)
    .addStringOption(option => option
    .setName('track')
    .setDescription('URL or search query')
    .setRequired(true));
exports.PLAY = new template_1.Command()
    .addIdentifiers('play', 'test2')
    .addBuilders(PLAY_SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(async (interaction) => {
    const voice = interaction.member.voice.channel;
    const client = interaction.client;
    if (!voice)
        return void interaction.reply({ content: '❌ You are not in a voice channel', ephemeral: true }).catch(console.warn);
    if (!voice.joinable)
        return void interaction.reply({ content: `❌ I do not have permission to connect ${voice}`, ephemeral: true }).catch(console.warn);
    // if (!interaction.guild.me.permissions.has('SPEAK'))
    //     return void interaction.reply({ content: `❌ I do not have permission to speak in ${voice}`, ephemeral: true }).catch(console.warn);
    if (voice.type !== discord_js_1.ChannelType.GuildVoice)
        return void interaction.reply({ content: ':x: Sorry, I don\'t currently support stage channels', ephemeral: true }).catch(console.warn);
    let subscription = client.subscriptions.get(interaction.guildId);
    let createdSubscription = false;
    if (!subscription) {
        subscription = new subscription_1.Subscription(client, interaction.guild, (0, voice_1.joinVoiceChannel)({
            channelId: voice.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        }), interaction, voice);
        subscription.connection.on('error', console.warn);
        client.subscriptions.set(interaction.guildId, subscription);
        createdSubscription = true;
    }
    try {
        await (0, voice_1.entersState)(subscription.connection, voice_1.VoiceConnectionStatus.Ready, 20e3);
    }
    catch (err) {
        console.warn(err);
        return interaction.reply({ ephemeral: true, content: 'I could not connect to your voice channel :(' }).catch(console.warn);
    }
    try {
        await interaction.deferReply({ ephemeral: !createdSubscription });
    }
    catch {
        return;
    }
    const input = interaction.options.getString('track', true);
    let videos = [];
    if ((0, ytdl_core_1.validateURL)(input) && input.includes('list')) {
        const id = input.split('list=')[1].split('&')[0];
        const playlist = await client.youtube.getPlaylistByID(id).catch(() => null);
        if (playlist)
            videos.push(...playlist);
    }
    else if ((0, ytdl_core_1.validateURL)(input)) {
        const video = await client.youtube.getVideo(input).catch(() => null);
        if (video)
            videos.push(video);
    }
    else {
        const search = await client.youtube.searchVideos(input, 10).catch(() => null);
        if (search)
            videos.push(search);
    }
    if (videos.length === 0) {
        if (createdSubscription)
            subscription.stop(true);
        return void interaction.editReply(':x: Search returned no videos')
            .then(reply => setTimeout(() => reply.delete(), 15000))
            .catch(console.warn);
    }
    const tracks = videos.map(video => new track_1.Track(video, subscription, interaction.member));
    subscription.enqueue(tracks);
    if (!createdSubscription)
        interaction.editReply(tracks.length === 1 ? `Added [${tracks[0]}](<${tracks[0].url}>) to the queue` : `Added ${tracks.length} tracks to the queue`).catch(console.warn);
});
