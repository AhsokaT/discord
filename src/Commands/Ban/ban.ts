import { Guild, GuildMember, User } from 'discord.js';

export function ban(target: GuildMember, reason = ''): Promise<GuildMember> {
    return target.ban({ reason });
}