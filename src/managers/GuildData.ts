import { APIApplicationCommand } from 'discord.js';
import { Client } from '../client/client.js';
import { PluginBitField, PluginBits } from '../util/PluginBitField.js';
import { BitField } from '../util/BitField.js';

export interface GuildDocument {
    _id: string;
    plugins: string;
}

export interface GuildDataEditOptions {
    plugins?: BitField.BitLike<keyof typeof PluginBits, number>;
}

export interface GuildDataPatchOptions {
    plugins?: BitField.BitLike<keyof typeof PluginBits, number>;
    commands?: APIApplicationCommand[];
}

export class GuildData {
    static from(client: Client, document: GuildDocument) {
        return new this(client, document._id, new PluginBitField(Number(document.plugins)));
    }

    static resolveOptions(options: GuildDataEditOptions) {
        return {
            plugins: options.plugins != null ? PluginBitField.reduce(options.plugins).toString() : '0'
        };
    }

    constructor(
        readonly client: Client,
        readonly id: string,
        readonly plugins = new PluginBitField(),
        readonly commands: Map<string, APIApplicationCommand> = new Map()
    ) {}

    _patch(data: GuildDataPatchOptions) {
        if (data.plugins != null)
            this.plugins.bits = PluginBitField.reduce(data.plugins);

        if (data.commands != null) {
            this.commands.clear();

            for (const command of data.commands)
                this.commands.set(command.id, command);
        }
    }

    async edit(data: GuildDataEditOptions) {
        await this.client.guildData.patch(this.id, data);

        return this;
    }

    setPlugins(plugins: BitField.BitLike<keyof typeof PluginBits, number>) {
        return this.edit({ plugins });
    }

    toJSON(): GuildDocument {
        return { _id: this.id, plugins: this.plugins.bits.toString() };
    }
}