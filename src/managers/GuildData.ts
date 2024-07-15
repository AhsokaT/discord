import { APIApplicationCommand } from 'discord.js';
import { PluginBitField, PluginBits } from '../util/PluginBitField.js';
import { BitField } from '../util/BitField.js';
import { Database } from './Database.js';

export interface GuildDataEditOptions {
    plugins?: BitField.BitLike<PluginBits.Key, number>;
}

export interface GuildDataPatchOptions {
    plugins?: BitField.BitLike<PluginBits.Key, number>;
    commands?: APIApplicationCommand[];
}

export class GuildData {
    static from(document: Database.GuildDocument) {
        return new this(
            document._id,
            new PluginBitField(Number(document.plugins))
        );
    }

    static resolveOptions(options: GuildDataEditOptions) {
        return {
            plugins:
                options.plugins != null
                    ? PluginBitField.reduce(options.plugins).toString()
                    : '0',
        };
    }

    constructor(
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
        // noop

        return this;
    }

    setPlugins(plugins: BitField.BitLike<PluginBits.Key, number>) {
        return this.edit({ plugins });
    }

    toJSON(): Database.GuildDocument {
        return { _id: this.id, plugins: this.plugins.bits.toString() };
    }
}
