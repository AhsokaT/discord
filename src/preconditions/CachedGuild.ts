import { Precondition } from '@sapphire/framework';
import { ChatInputCommandInteraction } from 'discord.js';

export class CachedGuild extends Precondition {
    chatInputRun(interaction: ChatInputCommandInteraction) {
        return interaction.inCachedGuild() ? this.ok() : this.error({ message: 'You can only use this command in a guild' });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        CachedGuild: never;
    }
}