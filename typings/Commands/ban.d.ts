import { ApplicationCommandDataResolvable, ButtonBuilder, GuildMember, Interaction, Snowflake } from 'discord.js';
import { Command } from '../client';
export declare class BanCommand implements Command {
    get names(): string[];
    get guilds(): Snowflake[];
    get commandBuilders(): ApplicationCommandDataResolvable[];
    receive(interaction: Interaction<'cached'>): void;
    private buildReasonModal;
    private receiveModalSubmit;
    private receiveButton;
    private receiveUserContextMenu;
    private receiveChatInput;
    static buildRevokeBanButton(banned: GuildMember): ButtonBuilder;
    private buildBanEmbed;
    private ban;
    private audit;
}
