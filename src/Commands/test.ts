import { ActionRowBuilder, MessageActionRowComponentBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { pointChangeEmbed, allPointChangeEmbed, LeaderboardButton, pointChangeButton } from './builders';
import { House, RoleHouse, RoleID } from './House/housePicker';
import { HousePoints } from './House/HousePointManager';
import { Command } from './template';

const SLASH = new SlashCommandBuilder()
    .setName('test')
    .setDescription('test')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export const TEST = new Command()
    .addIdentifiers('test')
    .addBuilders(SLASH)
    .addGuilds('509135025560616963')
    .onChatInputCommand(i => i.reply({
        embeds: [
            allPointChangeEmbed(
                Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {} as HousePoints),
                Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {} as HousePoints)
            ),
            pointChangeEmbed(RoleHouse[RoleID.OWL], Math.floor(Math.random() * 100), Math.floor(Math.random() * 100))
        ],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                pointChangeButton(
                    Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {} as HousePoints),
                    Object.keys(House).reduce((acc, h) => Object.assign(acc, { [h]: Math.floor(Math.random() * 100) }), {} as HousePoints)
                )!,
                LeaderboardButton()
            )
        ],
        ephemeral: true
    }).catch(console.debug));