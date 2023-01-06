import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';
import { ChannelID, Client } from '../../client';
import { HouseInfoButton, UserInfoButton } from '../builders';
import { Command } from '../template';
import { HouseID } from './HousePointManager';

export enum House {
    TIGER = 'Tiger Terror Squad',
    OWL = 'Court of Owls',
    RAVEN = 'Raven Reapers',
    TURTLE = 'The Otakus',
    PANDA = 'Pandamonium'
}

export enum HouseEmoji {
    TIGER = '🐯',
    OWL = '🦉',
    RAVEN = '👁️',
    TURTLE = '🐢',
    PANDA = '🐼'
}

export enum HouseDescription {
    TIGER = 'Competitive, crud central, Fearless, Rage',
    OWL = 'observant, Integrity, judge, They do not speak a lot but when they do, they talk wisely.',
    RAVEN = 'The eye of all eyes, Pure Daily Offenders, can be calm or on crud, depending on the tea or tequila!',
    TURTLE = 'chill, perseverance, otaku, cosplay(LOT\'S OF NOSE BLEEDS), gamers and tech enthusiast! ',
    PANDA = 'bashful, emotional, foodie, jokes, sleepy, knowledgeable.'
}

export enum RoleID {
    TIGER = '1024014286416261191',
    OWL = '1024014430448660490',
    RAVEN = '1024014477789773965',
    TURTLE = '1024014510723432478',
    PANDA = '1024014614536667239'
}

export enum RoleHouse {
    '1024014286416261191' = 'TIGER',
    '1024014430448660490' = 'OWL',
    '1024014477789773965' = 'RAVEN',
    '1024014510723432478' = 'TURTLE',
    '1024014614536667239' = 'PANDA'
}

export const HOUSE_COMMAND = new Command()
    .addIdentifiers('HOUSE', 'HOUSECONFIRM', 'HOUSEUNSURE')
    .onButton(async interaction => {
        if (interaction.customId === 'HOUSEUNSURE')
            return void interaction.update({ content: 'No house selected', components: [] }).catch(console.debug);
    
        if (!interaction.customId.startsWith('HOUSECONFIRM'))
            return;

        const selection = interaction.customId.split('_').pop() as HouseID | undefined;

        if (!selection)
            return console.error('Selection not included in custom ID');

        try {
            await interaction.update({
                components: [
                    new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel('Sign me up!')
                                .setCustomId(`HOUSECONFIRM_${selection}`)
                                .setDisabled(true)
                        )
                ]
            });
        } catch (err) {
            return console.debug(err);
        }

        try {
            await interaction.member.roles.add(RoleID[selection]);
        } catch (err) {
            interaction.editReply({ content: ':x: There was an error assigning your house, try again later', components: [] }).catch(console.debug);

            return console.error(err);
        }

        interaction.editReply({ content: `You have successfully joined **${House[selection]}**`, components: []}).catch(console.debug);

        (interaction.client as Client).sendToLogChannel({
            content: `${interaction.user} **became ${selection === 'OWL' ? 'an' : 'a'}** <@&${RoleID[selection]}>`,
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(UserInfoButton(interaction.user.id, 'Member'), HouseInfoButton(selection))
            ],
            allowedMentions: { parse: [] }
        }).catch(console.debug);

        const channel = await interaction.guild.channels.fetch(ChannelID[selection]).catch(console.debug);

        if (channel && channel.isTextBased())
            channel.send(`<@&${RoleID[selection]}> ${interaction.user} **has joined the house!** Give them a warm welcome! :smile:`)
                .then(message => {
                    message.react('🥳');
                    message.react(HouseEmoji[selection]);
                })
                .catch(console.debug);
    })
    .onSelectMenu(interaction => {
        const [selection] = interaction.values;

        if (!selection) {
            console.debug('Select Menu Interaction did not include values');
            return void interaction.reply({ ephemeral: true, content: 'There was an error with your selection' }).catch(console.debug);
        }

        if (interaction.member.roles.cache.hasAny(...Object.values(RoleID)) && interaction.member.user.id !== '451448994128723978')
            return void interaction.reply({ content: 'You cannot join another house', ephemeral: true }).catch(console.debug);

        interaction.reply({
            ephemeral: true,
            content: `Are you sure you want to join **${House[selection]}** <@&${RoleID[selection]}>? Once you join, you cannot change your house`,
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel('I\'m not sure yet')
                            .setCustomId(`HOUSEUNSURE`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('Sign me up!')
                            .setCustomId(`HOUSECONFIRM_${selection}`)
                    )
            ]
        }).catch(console.debug);
    });