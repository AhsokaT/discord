import { ButtonBuilder, ButtonStyle, GuildMember } from 'discord.js';

export function revokeBanButton(banned: GuildMember) {
    return new ButtonBuilder()
        .setCustomId(`UNBAN_${banned.id}`)
        .setLabel('Revoke ban')
        .setStyle(ButtonStyle.Primary);
}