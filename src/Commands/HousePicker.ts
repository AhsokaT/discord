import { ActionRowBuilder, MessageActionRowComponentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { House } from '../Util/enum';
import { Command, container } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Command.Options>({
    name: 'choosehouse',
    description: 'Choose your house!'
})
export class HousePicker extends Command {
    chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (!interaction.inCachedGuild())
            return void interaction.reply({ content: 'error', ephemeral: true });

        if (interaction.member.roles.cache.hasAny(...House.ALL.map(house => house.roleId)))
            return void interaction.reply({ content: 'You have already joined a house!', ephemeral: true });

        const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>();

        const buttons = House.ALL.map(house =>
            new ButtonBuilder()
                .setCustomId(`CHOOSEHOUSE_${house.id}`)
                .setLabel(house.name)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(house.emoji)
        );

        actionRow.addComponents(buttons);

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Choose your house')
            .setDescription('You can only join a house once, choose wisely!')
            .addFields(House.ALL.map(house => ({ name: `${house.emoji} ${house.name}`, value: `<@&${house.roleId}> ${house.description}` })));

        interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand({ name: this.name, description: this.description }, { guildIds: ['509135025560616963'] });
    }
}

container.stores.loadPiece({
    piece: HousePicker,
    name: HousePicker.name,
    store: 'commands'
});