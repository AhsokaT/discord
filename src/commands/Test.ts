import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'test',
    description: 'Command for testing things',
})
export class Test extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const isProduction =
            '_' in process && String(process._).includes('heroku');

        if (isProduction) return interaction.reply({ content: 'noop', ephemeral: true });

        interaction.reply({ ephemeral: true, content: 'noop (pass production check)' });
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
