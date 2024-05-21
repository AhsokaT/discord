import { ActionRowBuilder, MessageActionRowComponentBuilder, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { Client } from '../Client/client';
import { allPointChangeEmbed, LeaderboardButton, pointChangeButton, pointChangeEmbed } from '../Util/builders';
import { Command, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { House, ChannelId, HouseId } from '../util/enum';
import { HousePoints } from '../Database/DatabaseManager';

@ApplyOptions<Command.Options>({
    name: 'housepoints',
    description: 'Add or remove points from houses'
})
export class HousePointsCommand extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client as Client;
        const current = Object.fromEntries([...client.database.cache]) as HousePoints;

        const newTotals: HousePoints = {
            TIGER: interaction.options.getInteger('tigers') ?? current.TIGER,
            OWL: interaction.options.getInteger('owls') ?? current.OWL,
            RAVEN: interaction.options.getInteger('ravens') ?? current.RAVEN,
            TURTLE: interaction.options.getInteger('turtles') ?? current.TURTLE,
            PANDA: interaction.options.getInteger('pandas') ?? current.PANDA
        };

        let changes = Object.keys(newTotals)
            .filter(house => newTotals[house] !== current[house])
            .map(house => [house, newTotals[house]]) as [HouseId, number][];

        if (changes.length === 0)
            return void interaction.editReply('No changes were made');

        try {
            await client.database.patch(changes);
        } catch(err) {
            console.error(err);
        }

        Object.keys(newTotals)
            .filter(house => newTotals[house] !== current[house])
            .forEach(async (houseId: HouseId) => {
                const changeButton = pointChangeButton(current, newTotals);
                const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();
                const house = House[houseId];

                if (changeButton)
                    actionRow.addComponents(changeButton, LeaderboardButton());
                else
                    actionRow.addComponents(LeaderboardButton());

                const channel = await client.channels.fetch(house.channelId) as TextChannel;

                channel.send({
                    embeds: [pointChangeEmbed(houseId, current[houseId], newTotals[houseId], interaction.user)],
                    components: [actionRow]
                })
                .catch(console.debug);
            });

        const changed = Object.keys(newTotals).some(house => newTotals[house] !== current[house]);

        interaction.editReply(changed ? 'Changes made' : 'No changes were made').catch(console.debug);

        if (!changed)
            return;

        try {
            const [logs, trophy] = await Promise.all([client.channels.fetch(ChannelId.Logs), client.channels.fetch(ChannelId.Trophy)]) as [TextChannel, TextChannel];

            const payload = {
                embeds: [allPointChangeEmbed(current, newTotals, interaction.user)],
                allowedMentions: { parse: [] },
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(LeaderboardButton())
                ]
            };

            logs.send(payload);
            trophy.send(payload);
        } catch(err) {
            console.error(err);
        }
    }

    registerApplicationCommands(registry: Command.Registry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

        for (const house of House.ALL)
            builder.addIntegerOption(
                option => option
                    .setName(house.id.toLowerCase().replace(/(\b\w+\b)/g, '$1s'))
                    .setDescription(`New total for ${house.name}`)
            );

        registry.registerChatInputCommand(builder, { guildIds: ['509135025560616963'] });
    }
}

container.stores.loadPiece({
    piece: HousePointsCommand,
    name: HousePointsCommand.name,
    store: 'commands'
});