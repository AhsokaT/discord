import { ApplicationCommandDataResolvable, ButtonInteraction, CacheType, ChatInputCommandInteraction, Interaction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction, Snowflake, UserContextMenuCommandInteraction } from 'discord.js';
export type InteractionCallback<I extends Interaction> = (interaction: I, command: Command<I extends Interaction<infer Cached> ? Cached : never>) => void;
export type BuilderFunction<B extends ApplicationCommandDataResolvable> = (builder: B) => B;
export type Builder<B extends ApplicationCommandDataResolvable> = B | BuilderFunction<B>;
export declare class Command<Cached extends CacheType = 'cached'> {
    #private;
    get commandBuilders(): ApplicationCommandDataResolvable[];
    get identifiers(): string[];
    get guilds(): string[];
    addGuilds(...IDs: Snowflake[]): this;
    addIdentifiers(...ids: string[]): this;
    addBuilders(...builders: ApplicationCommandDataResolvable[]): this;
    receive(interaction: Interaction<Cached>): void;
    onInteraction(callback: InteractionCallback<Interaction<Cached>>): this;
    onButton(callback: InteractionCallback<ButtonInteraction<Cached>>): this;
    onSelectMenu(callback: InteractionCallback<SelectMenuInteraction<Cached>>): this;
    onUserContextMenuCommand(callback: InteractionCallback<UserContextMenuCommandInteraction<Cached>>): this;
    onChatInputCommand(callback: InteractionCallback<ChatInputCommandInteraction<Cached>>): this;
    onMessageContextMenuCommand(callback: InteractionCallback<MessageContextMenuCommandInteraction<Cached>>): this;
    onModalSubmit(callback: InteractionCallback<ModalSubmitInteraction<Cached>>): this;
}
