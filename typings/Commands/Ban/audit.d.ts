import { GuildMember, Message } from 'discord.js';
export declare function audit(banned: GuildMember, moderator: GuildMember, reason: string): Promise<Message<true>>;
