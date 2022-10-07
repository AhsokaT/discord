"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    #identifiers = [];
    #guilds = [];
    #builders = [];
    #interactionCallback = null;
    #buttonCallback;
    #selectMenuCallback = null;
    #userContextMenuCallback = null;
    #chatInputCommandCallback = null;
    #messageContextMenuCommandCallback = null;
    get commandBuilders() {
        return this.#builders;
    }
    get identifiers() {
        return this.#identifiers;
    }
    get guilds() {
        return this.#guilds;
    }
    addGuilds(...IDs) {
        this.#guilds.push(...IDs);
        return this;
    }
    addIdentifiers(...ids) {
        this.#identifiers.push(...ids);
        return this;
    }
    addBuilders(...builders) {
        this.#builders.push(...builders);
        return this;
    }
    receive(interaction) {
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
    onInteraction(callback) {
        this.#interactionCallback = callback;
        return this;
    }
    onButton(callback) {
        this.#buttonCallback = callback;
        return this;
    }
    onSelectMenu(callback) {
        this.#selectMenuCallback = callback;
        return this;
    }
    onUserContextMenuCommand(callback) {
        this.#userContextMenuCallback = callback;
        return this;
    }
    onChatInputCommand(callback) {
        this.#chatInputCommandCallback = callback;
        return this;
    }
    onMessageContextMenuCommand(callback) {
        this.#messageContextMenuCommandCallback = callback;
        return this;
    }
    onModalSubmit(callback) {
        return this;
    }
}
exports.Command = Command;
