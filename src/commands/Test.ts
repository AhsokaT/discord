import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ButtonStyle, ComponentType, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'test2',
    description: 'Testbed for new features',
})
export class Test extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        let time = performance.now();
        await interaction.deferReply({ ephemeral: true });
        time = performance.now() - time;

        const embed = new EmbedBuilder()
            .setColor(`#2B2D31`)
            .setTitle('Changes staged')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .addFields({ name: 'Changes', value: `${time.toFixed(2)}ms` });

        await interaction.editReply({
            embeds: [embed],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: 1,
                            customId: 'test',
                            label: 'Commit',
                        },
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Secondary,
                            customId: 'test2',
                            label: 'Cancel',
                        },
                    ],
                },
            ],
        });
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
