import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, ModalSubmitInteraction, Snowflake, UserContextMenuCommandInteraction } from 'discord.js';
import type { Command } from '../client';
export declare class KickCommand implements Command {
    get names(): string[];
    get guilds(): Snowflake[];
    get commandBuilders(): ApplicationCommandDataResolvable[];
    receive(interaction: UserContextMenuCommandInteraction<'cached'>): void;
    receive(interaction: ChatInputCommandInteraction<'cached'>): void;
    receive(interaction: ModalSubmitInteraction<'cached'>): void;
    private receiveModalSubmit;
    private receiveUserContextMenu;
    private receiveChatInput;
    private buildKickEmbed;
    private kick;
    private audit;
}
