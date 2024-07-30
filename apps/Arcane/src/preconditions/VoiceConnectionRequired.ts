import { Precondition } from '@sapphire/framework';
import { ChatInputCommandInteraction } from 'discord.js';

export class VoiceConnectionRequired extends Precondition {
    chatInputRun(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild())
            return this.error({ message: 'You can only use this command in a server.' });

        return interaction.member.voice.channel ? this.ok() : this.error({ message: 'You must be in a voice channel to use this command' });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        VoiceConnectionRequired: never;
    }
}