import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, GuildTextBasedChannel, Message, MessageActionRowComponentBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './template';

const SLASH = new SlashCommandBuilder()
    .setName('message')
    .setDescription('Send a message to a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('Channel to send message to')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('message')
        .setDescription('Message to send')
        .setRequired(true)
    );

export const MESSAGE = new Command()
    .addGuilds('509135025560616963')
    .addBuilders(SLASH)
    .addIdentifiers('message')
    .onChatInputCommand(async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
        } catch {
            return;
        }

        const channel = interaction.options.getChannel('channel', true) as GuildTextBasedChannel;
        const content = interaction.options.getString('message', true);

        let message: Message;

        try {
            message = await channel.send(content);
        } catch {
            return void interaction.editReply('Failed to send message :(');
        }

        interaction.editReply({
            content: `[Message](${message.url}) sent to ${channel}`,
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`MESSAGEDELETE_${message.channelId}_${message.id}`)
                        .setLabel('Delete')
                        .setStyle(ButtonStyle.Danger)
                )
            ]
        }).catch(console.warn);
    });