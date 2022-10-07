import { Message, Snowflake } from 'discord.js';
import { Client } from './client';
import { HouseParticipants, HousePoints } from './Commands/House/HousePointManager';
export declare function logHousePointChange(client: Client, change: 'assigned' | 'removed', house: HouseParticipants, points: number): Promise<Message<true>>;
export declare function updateHousePoints(client: Client<true>, channelID: Snowflake, messageID: Snowflake, points: HousePoints): Promise<Message<true>>;
export declare function postHousePicker(client: Client<true>): Promise<Message<true>>;
