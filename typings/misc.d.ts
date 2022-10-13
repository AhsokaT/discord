import { Message, Snowflake, TextChannel } from 'discord.js';
import { Client } from './client';
import { HousePoints } from './Commands/House/HousePointManager';
export declare function sendToLogChannel(client: Client, message: Parameters<TextChannel['send']>[0]): Promise<Message<true>>;
export declare function updateHousePoints(client: Client<true>, channelID: Snowflake, messageID: Snowflake, points: HousePoints): Promise<Message<true>>;
export declare function postHousePicker(client: Client<true>): Promise<Message<true>>;
