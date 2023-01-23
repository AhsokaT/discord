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
            .addStringOption(option => option
                .setName('author')
                .setDescription('Author of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('footer')
                .setDescription('Footer of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('thumbnail')
                .setDescription('Thumbnail of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('image')
                .setDescription('Image of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('url')
                .setDescription('URL of the title of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('authoriconurl')
                .setDescription('Icon of the author of the embed')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('footericonurl')
                .setDescription('Icon of the footer of the embed')
                .setRequired(false)
            )
    );

export const MESSAGE = new Command()
    .addGuilds('509135025560616963')
    .addBuilders(SLASH)
    .addIdentifiers('send', 'send message', 'send embed')
    .onChatInputCommand(async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
        } catch {
            return;
        }

        if (interaction.options.getSubcommand(true) === 'message') {    
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
        const author = interaction.options.getString('author', false);
        const footer = interaction.options.getString('footer', false);
        const thumbnail = interaction.options.getString('thumbnail', false);
        const image = interaction.options.getString('image', false);
        const url = interaction.options.getString('url', false);
        const authorIcon = interaction.options.getString('authoriconurl', false);
        const footerIcon = interaction.options.getString('footericonurl', false);

        const embed = new EmbedBuilder();

        if (colour)
            embed.setColor(Colors[colour]);

        if (description)
            embed.setDescription(description);

        if (title)
            embed.setTitle(title);

        if (author && authorIcon)
            embed.setAuthor({ name: author, iconURL: authorIcon });
        else if (author)
            embed.setAuthor({ name: author });
        else if (authorIcon)
            embed.setAuthor({ name: '', iconURL: authorIcon });

        if (footer)
            embed.setFooter({ text: footer });

        if (thumbnail)
            embed.setThumbnail(thumbnail);

        if (image)
            embed.setImage(image);

        if (url)
            embed.setURL(url);

        channel.send({ embeds: [embed] })
            .then(m => {
                setTimeout(() => m.delete(), 15000);
                return m;
            })
            .then(m => interaction.editReply(`[Message](${m.url}) sent in ${m.channel}`))
            .catch(() => interaction.editReply('Failed to send message'));
    });