import { ActionRowBuilder, MessageActionRowComponentBuilder } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, container } from '@sapphire/framework';
import { DeleteInteractionButton, LeaderboardEmbed, UpdateLeaderboardButton } from '../util/builders';
import { Client } from '../Client/client';

@ApplyOptions<Command.Options>({
    name: 'leaderboard',
    description: 'See who\'s ahead in the house competitions'
})
export class Leaderboard extends Command {
    chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        interaction.reply({
            embeds: [LeaderboardEmbed(interaction.client as Client)],
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(UpdateLeaderboardButton(), DeleteInteractionButton())
            ],
            allowedMentions: { parse: [] }
        }).catch(console.error);
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand({ name: this.name, description: this.description }, { guildIds: ['509135025560616963'] });
    }
}

container.stores.loadPiece({
    piece: Leaderboard,
    name: Leaderboard.name,
    store: 'commands'
});