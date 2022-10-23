import { Message, Snowflake, TextChannel } from 'discord.js';
import { Client } from './client';
export declare function sendToLogChannel(client: Client, message: Parameters<TextChannel['send']>[0]): Promise<Message<true>>;
export declare function updateHousePoints(client: Client<true>, channelID: Snowflake, messageID: Snowflake): Promise<Message<true>>;
export declare function postHousePicker(client: Client<true>): Promise<Message<true>>;
