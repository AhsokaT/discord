import { ApplicationCommandDataResolvable, ButtonInteraction, CacheType, ChatInputCommandInteraction, Interaction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction, SlashCommandBuilder, Snowflake, UserContextMenuCommandInteraction } from 'discord.js';

export type InteractionCallback<I extends Interaction> = (interaction: I, command: Command<I extends Interaction<infer Cached> ? Cached : never>) => void;
export type BuilderFunction<B extends ApplicationCommandDataResolvable> = (builder: B) => B;
export type Builder<B extends ApplicationCommandDataResolvable> =
    | B
    | BuilderFunction<B>;

export class Command<Cached extends CacheType = 'cached'> {
    #identifiers: string[] = []
    #guilds: Snowflake[] = [];
    #builders: ApplicationCommandDataResolvable[] = [];
    #interactionCallback: InteractionCallback<Interaction<Cached>> | null = null;
    #buttonCallback: InteractionCallback<ButtonInteraction<Cached>> | null = null;
    #selectMenuCallback: InteractionCallback<SelectMenuInteraction<Cached>> | null = null;
    #userContextMenuCallback: InteractionCallback<UserContextMenuCommandInteraction<Cached>> | null = null;
    #chatInputCommandCallback: InteractionCallback<ChatInputCommandInteraction<Cached>> | null = null;
    #messageContextMenuCommandCallback: InteractionCallback<MessageContextMenuCommandInteraction<Cached>> | null = null;

    get commandBuilders() {
        return this.#builders;
    }

    get identifiers() {
        return this.#identifiers;
    }

    get guilds() {
        return this.#guilds;
    }

    addGuilds(...IDs: Snowflake[]) {
        this.#guilds.push(...IDs);

        return this;
    }

    addIdentifiers(...ids: string[]) {
        this.#identifiers.push(...ids);

        return this;
    }

    addBuilders(...builders: ApplicationCommandDataResolvable[]) {
        this.#builders.push(...builders);

        return this;
    }

    receive(interaction: Interaction<Cached>) {
        if (this.#interactionCallback)
            this.#interactionCallback(interaction, this);

        if (interaction.isButton() && this.#buttonCallback)
            return this.#buttonCallback(interaction, this);

        if (interaction.isSelectMenu() && this.#selectMenuCallback)
            return this.#selectMenuCallback(interaction, this);

        if (interaction.isUserContextMenuCommand() && this.#userContextMenuCallback)
            return this.#userContextMenuCallback(interaction, this);

        if (interaction.isChatInputCommand() && this.#chatInputCommandCallback)
            return this.#chatInputCommandCallback(interaction, this);

        if (interaction.isMessageContextMenuCommand() && this.#messageContextMenuCommandCallback)
            return this.#messageContextMenuCommandCallback(interaction, this);
    }

    onInteraction(callback: InteractionCallback<Interaction<Cached>>) {
        this.#interactionCallback = callback;

        return this;
    }

    onButton(callback: InteractionCallback<ButtonInteraction<Cached>>) {
        this.#buttonCallback = callback;

        return this;
    }

    onSelectMenu(callback: InteractionCallback<SelectMenuInteraction<Cached>>) {
        this.#selectMenuCallback = callback;

        return this;
    }

    onUserContextMenuCommand(callback: InteractionCallback<UserContextMenuCommandInteraction<Cached>>) {
        this.#userContextMenuCallback = callback;

        return this;
    }

    onChatInputCommand(callback: InteractionCallback<ChatInputCommandInteraction<Cached>>) {
        this.#chatInputCommandCallback = callback;

        return this;
    }

    onMessageContextMenuCommand(callback: InteractionCallback<MessageContextMenuCommandInteraction<Cached>>) {
        this.#messageContextMenuCommandCallback = callback;

        return this;
    }

    onModalSubmit(callback: InteractionCallback<ModalSubmitInteraction<Cached>>) {
        return this;
    }
}