import { ButtonBuilder, EmbedBuilder, Snowflake } from 'discord.js';
import { HouseParticipants } from './House/HousePointManager';
export declare const UserInfoButton: (user: Snowflake, label?: string) => ButtonBuilder;
export declare const HouseInfoButton: (house: HouseParticipants, label?: string) => ButtonBuilder;
export declare const RevokeBanButton: (user: Snowflake, label?: string) => ButtonBuilder;
export declare const BanButton: (user: Snowflake, label?: string) => ButtonBuilder;
export declare const LeaderboardEmbed: (sorted: [string, number][]) => EmbedBuilder;
