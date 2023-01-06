import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../template';

const SLASH_COMMAND = new SlashCommandBuilder()
    .setName('renamehouse')
    .setDescription('Rename a house')
    .addRoleOption(option => option
        .setName('house')
        .setDescription('The house to rename')
    )
    .addStringOption(option => option
        .setName('name')
        .setDescription('The new name of the house')
    );

export const RENAME_HOUSE = new Command()
    .addIdentifiers('renamehouse')
    .addBuilders(SLASH_COMMAND)
    .addGuilds('509135025560616963')
    .onChatInputCommand(interaction => {
        interaction.reply('renamehouse');
    });