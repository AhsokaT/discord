import { ApplyOptions } from '@sapphire/decorators';
import { Command, container } from '@sapphire/framework';
import { Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'embed',
    description: 'Test'
})
export class Embed extends Command {
    chatInputRun(interaction: Command.ChatInputCommandInteraction) {

        const embed = new EmbedBuilder();

        if (interaction.options.getString('title'))
            embed.setTitle(interaction.options.getString('title'));

        if (interaction.options.getString('description'))
            embed.setDescription(interaction.options.getString('description'));

        if (interaction.options.getInteger('colour'))
            embed.setColor(interaction.options.getInteger('colour'));

        if (interaction.options.getBoolean('author'))
            embed.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

        interaction.reply({
            embeds: [embed],
            allowedMentions: { parse: [] },
            ephemeral: true
        }).catch(console.error);
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            builder => builder
                .setName(this.name)
                .setDescription(this.description)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
                .addStringOption(
                    option => option
                        .setName('title')
                        .setDescription('Embed title')
                )
                .addStringOption(
                    option => option
                        .setName('description')
                        .setDescription('Embed description')
                )
                .addIntegerOption(
                    option => option
                        .setName('colour')
                        .setDescription('Embed colour')
                        .addChoices(Object.entries(Colors).map(([name, value]) => ({ name, value })).slice(0, 25))
                )
                .addBooleanOption(
                    option => option
                        .setName('author')
                        .setDescription('Display the author of the embed')
                ),
            { guildIds: ['509135025560616963'] }
        );
    }
}

container.stores.loadPiece({
    piece: Embed,
    name: Embed.name,
    store: 'commands'
});