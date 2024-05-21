import { ApplyOptions } from '@sapphire/decorators';
import { Command, container } from '@sapphire/framework';
import { allPointChangeEmbed, pointChangeEmbed } from '../Util/builders';
import { PermissionFlagsBits } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'test',
    description: 'Test'
})
export class Test extends Command {
    chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        interaction.reply({
            embeds: [
                allPointChangeEmbed({ TIGER: 0, OWL: 0, RAVEN: 0, TURTLE: 0, PANDA: 0 }, { TIGER: 1, OWL: 2, RAVEN: 3, TURTLE: 4, PANDA: 5 }, interaction.user),
                pointChangeEmbed('TIGER', 0, 1, interaction.user)
            ],
            allowedMentions: { parse: [] }
        }).catch(console.error);
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            builder => builder
                .setName(this.name)
                .setDescription(this.description)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
            { guildIds: ['509135025560616963'] }
        );
    }
}

container.stores.loadPiece({
    piece: Test,
    name: Test.name,
    store: 'commands'
});