import { Message, TextChannel, Client as DJSClient } from 'discord.js';
import { Client } from './client';
export declare function sendToLogChannel(client: DJSClient, message: Parameters<TextChannel['send']>[0]): Promise<Message<true>>;
export declare function postHousePicker(client: Client<true>): Promise<Message<true>>;
