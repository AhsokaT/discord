import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder, RoleSelectMenuBuilder } from 'discord.js';
import { Client } from '../client';
import { UserInfoButton } from '../Commands/builders';
import { ClientEvent } from './ClientEvent';

export const guildMemberAdd = new ClientEvent('guildMemberAdd', async member => {
    const channel = await (member.client as Client).channels.fetch('1017094377690108046');

    if (channel && channel.isTextBased())
        channel.send({
            content: `Welcome ${member}`,
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    new ButtonBuilder()
                        .setLabel('Choose house')
                        .setCustomId('SETUP')
                        .setStyle(ButtonStyle.Primary)
                )
            ]
        }).then(m => setTimeout(() => m.delete(), 10000));

    // const embed = new EmbedBuilder()
    //     .setColor('#2F3136')
    //     .setTitle('Member joined')
    //     .setAuthor({ name: member.user.tag })
    //     .addFields(
    //         { name: 'Member', value: member.toString(), inline: true },
    //         { name: 'Joined', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
    //     );

    // (member.client as Client).sendToLogChannel({
    //     embeds: [embed],
    //     components: [
    //         new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UserInfoButton(member.user.id))
    //     ],
    //     allowedMentions: { parse: [] }
    // })
    // .catch(console.debug);
});