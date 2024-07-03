import { Command } from '@sapphire/framework';
import { PieceOptions } from '../util/util.js';
import { SlashCommandBuilder } from 'discord.js';
import { MusicCommand } from '../music/MusicCommand.js';
import { Subscription } from '../music/Subscription.js';
import { PluginBits } from '../util/PluginBitField.js';

@PieceOptions({
    name: 'clear',
    description: 'Clear the queue',
    preconditions: ['VoiceChannelLock']
})
export class Clear extends MusicCommand {
    static readonly builder = new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue');

    static readonly plugin = PluginBits.Music;

    async run(interaction: Command.ChatInputCommandInteraction<'cached'>, subscription: Subscription) {
        if (subscription.queue.length === 0)
            return void interaction.reply({ content: 'the queue is empty (ー_ー)!!', ephemeral: true });

        subscription.queue.length = 0;

        subscription.messages.patch();

        interaction.reply({ content: 'I have cleared the queue!', ephemeral: true });
    }
}