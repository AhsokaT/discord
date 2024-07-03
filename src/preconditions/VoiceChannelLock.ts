import { Precondition } from '@sapphire/framework';
import { ChatInputCommandInteraction } from 'discord.js';
import { Client } from '../client/client.js';

export class VoiceChannelLock extends Precondition {
    async chatInputRun(interaction: ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild())
            return this.error({ message: 'You can only use this command in a guild.' });

        const subscription = (interaction.client as Client).subscriptions.get(interaction.guildId);

        if (!subscription)
            return this.error({ message: 'There is no active subscription.' });

        return interaction.member.voice.channelId === subscription.voice.id ? this.ok() : this.error({ message: `You must be in ${subscription.voice} to use this command` });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        VoiceChannelLock: never;
    }
}