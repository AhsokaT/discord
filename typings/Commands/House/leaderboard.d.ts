import { EmbedBuilder } from 'discord.js';
import { Command } from '../template';
import { HousePoints } from './HousePointManager';
export declare const buildLeaderboard: (points: HousePoints) => EmbedBuilder;
export declare const LEADERBOARD: Command<"cached">;
