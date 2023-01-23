import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Colors, EmbedBuilder, GuildTextBasedChannel, Message, MessageActionRowComponentBuilder, PermissionFlagsBits, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextBasedChannel } from 'discord.js';
import { Command } from './template';

const SLASH = new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send content to a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(
        new SlashCommandSubcommandBuilder()
            .setName('message')
            .setDescription('Send a message to a channel')
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
            )
    )
    .addSubcommand(
        new SlashCommandSubcommandBuilder()
            .setName('embed')
            .setDescription('Construct and send an embed to a channel')
            .addChannelOption(option => option
                .addChannelTypes(ChannelType.GuildText)
                .setName('channel')
                .setDescription('Channel to send the embed in')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('title')
                .setDescription('Title of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('description')
                .setDescription('Description of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('color')
                .setDescription('Color of the embed')
                .addChoices(...Object.keys(Colors).slice(0, 25).map(colour => ({ name: colour, value: colour })))
                .setRequired(false)
            )
    );

export const MESSAGE = new Command()
    .addGuilds('509135025560616963')
    .addBuilders(SLASH)
    .addIdentifiers('send message', 'send embed')
    .onChatInputCommand(async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
        } catch {
            return;
        }

        if (interaction.commandName === 'send message') {    
            const channel = interaction.options.getChannel('channel', true) as GuildTextBasedChannel;
            const content = interaction.options.getString('message', true);
    
            let message: Message;
    
            try {
                message = await channel.send(`\` Author \` ${interaction.user}\n${content}}`);
            } catch {
                return void interaction.editReply('Failed to send message :(');
            }
    
            return void interaction.editReply({
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
        }

        const channel = interaction.options.getChannel('channel', true) as TextBasedChannel;
        const colour = interaction.options.getString('color', false);
        const description = interaction.options.getString('description', false);
        const title = interaction.options.getString('title', false);

        const embed = new EmbedBuilder();

        if (colour)
            embed.setColor(Colors[colour]);

        if (description)
            embed.setDescription(description);

        if (title)
            embed.setTitle(title);

        channel.send({ embeds: [embed] })
            .then(m => {
                setTimeout(() => m.delete(), 15000);
                return m;
            })
            .then(m => interaction.editReply(`[Message](${m.url}) sent in ${m.channel}`))
            .catch(() => interaction.editReply('Failed to send message'));
    });