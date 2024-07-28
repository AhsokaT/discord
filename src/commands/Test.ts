import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { House } from '../util/enum.js';

@ApplyOptions<Command.Options>({
    name: 'test',
    description: 'Command for testing things',
})
export class Test extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        // const isProduction =
        //     '_' in process && String(process._).includes('heroku');

        // if (isProduction) return interaction.reply({ content: 'noop', ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Leaderboard');

        for (const [house, points] of interaction.client.store.toSorted()) {
            embed.addFields({
                name: `${House[house].emoji} ${House[house].name}`,
                value: `${points} points`,
            });
        }

        return await interaction.reply({ ephemeral: true, embeds: [embed] });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDefaultMemberPermissions(
                        PermissionFlagsBits.ManageGuild
                    ),
            { guildIds: ['509135025560616963'] }
        );
    }
}
