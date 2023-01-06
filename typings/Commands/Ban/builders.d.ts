import { ButtonBuilder, EmbedBuilder, GuildMember, ModalBuilder } from "discord.js";
export declare const buildReasonModal: (member: GuildMember) => ModalBuilder;
export declare const buildBanRevokeButton: (banned: GuildMember) => ButtonBuilder;
export declare const buildBanEmbed: (banned: GuildMember, moderator: GuildMember) => EmbedBuilder;
