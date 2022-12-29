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
    .setDescription('Stream music')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Speak)
    .addStringOption(option => option
    .setName('track')
    .setDescription('URL or search query')
    .setRequired(true));
exports.PLAY = new template_1.Command()
    .addIdentifiers('play')
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
            selfDeaf: true
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
    let url = null;
    if ((0, ytdl_core_1.validateURL)(input)) {
        url = input;
    }
    else {
        const search = await client.youtube.searchVideos(input, 1).catch(console.warn);
        if (search)
            url = search.url;
    }
    if (!url)
        return void interaction.editReply(':x: Search returned no videos').catch(console.warn);
    if (subscription.queue.find((video) => video.url === url))
        return void interaction.editReply('Track is already in the queue 🎶').catch(console.warn);
    try {
        const track = await track_1.Track.from(url, subscription, interaction.member);
        subscription.enqueue(track);
        if (!createdSubscription)
            interaction.editReply(`[${track}](<${url}>) is number ${subscription.queue.findIndex(track => track.url === url) + 1} in the queue`);
    }
    catch (err) {
        console.warn(err);
        interaction.editReply(':x: An error occurred whilst fetching the track').catch(console.warn);
    }
});
