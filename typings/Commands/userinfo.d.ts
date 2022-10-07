import { ApplicationCommandDataResolvable, Interaction } from 'discord.js';
import { Command } from '../client';
export declare class UserInfoCommand implements Command {
    get names(): string[];
    get commandBuilders(): ApplicationCommandDataResolvable[];
    get guilds(): string[];
    receive(interaction: Interaction<'cached'>): void;
    private receiveButton;
    private receiveUserContextMenu;
    private sendInfoEmbed;
}
