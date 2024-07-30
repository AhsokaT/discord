import { BitField } from './BitField.ts';

export const PluginBits = {
    Settings: 1,
    Music: 2,
    Information: 4,
} as const;

export namespace PluginBits {
    export type Bit = typeof PluginBits[keyof typeof PluginBits];
    export type Key = keyof typeof PluginBits;
}

export class PluginBitField extends BitField<PluginBits.Key, number> {
    static readonly Flags = PluginBits;
    static readonly initialBits =
        Object.values(PluginBits).reduce((acc, bits) => acc | bits, 0);
}
