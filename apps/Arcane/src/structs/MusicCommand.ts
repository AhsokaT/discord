import { Command } from '@sapphire/framework';
import { Subscription } from './Subscription.js';

export abstract class MusicCommand extends Command {
    constructor(ctx: Command.LoaderContext, options: Command.Options) {
        super(ctx, {
            ...options,
            preconditions: options.preconditions
                ? ['CachedGuild', ...options.preconditions]
                : ['CachedGuild'],
        });
    }

    abstract run(
        interaction: Command.ChatInputCommandInteraction<'cached'>,
        subscription: Subscription
    ): void;

    async chatInputRun(
        interaction: Command.ChatInputCommandInteraction<'cached'>
    ) {
        const client = interaction.client;
        const subscription = client.subscriptions.get(interaction.guildId);

        if (!subscription) {
            const guild = await client.guildData.fetch(interaction.guildId);

            for (const [, command] of guild.commands) {
                if (command.name !== 'play') continue;

                return void interaction
                    .reply({
                        content: `Nothing is playing! You can use </play:${command.id}> to play music.`,
                        ephemeral: true,
                    })
                    .catch(console.error);
            }

            return void interaction
                .reply({ content: 'Nothing is playing!', ephemeral: true })
                .catch(console.error);
        }

        this.run(interaction, subscription);
    }
}
