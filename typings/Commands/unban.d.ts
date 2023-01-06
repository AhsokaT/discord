import { ApplicationCommandDataResolvable, ButtonInteraction, Snowflake } from 'discord.js';
import { Command } from '../client';
export declare class UnbanCommand implements Command {
    get names(): string[];
    get commandBuilders(): ApplicationCommandDataResolvable[];
    get guilds(): Snowflake[];
    receive(interaction: ButtonInteraction<'cached'>): void;
    private receiveButton;
    private audit;
}
