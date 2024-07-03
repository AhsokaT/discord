export namespace BitField {
    export type BitLike<S extends string, B extends number | bigint> =
        | B
        | B[]
        | S
        | S[]
        | BitField<S, B>
        | BitField<S, B>[]
    ;
}

export abstract class BitField<K extends string, B extends number | bigint> {
    constructor(bits?: BitField.BitLike<K, B>) {
        this.bits = this.#reduce(bits ?? (this.constructor as any).initialBits);
    }

    public bits: B;

    #reduce(bits: BitField.BitLike<K, B>) {
        return (this.constructor as typeof BitField<K, B>).reduce(bits);
    }

    has(bits: BitField.BitLike<K, B>) {
        const reduced = this.#reduce(bits);
        return (this.bits & reduced) === reduced;
    }

    some(bits: BitField.BitLike<K, B>) {
        return (this.#reduce(bits) | this.bits) !== 0;
    }

    add(bits: BitField.BitLike<K, B>) {
        // @ts-expect-error
        this.bits |= this.#reduce(bits);
        return this;
    }

    remove(bits: BitField.BitLike<K, B>) {
        // @ts-expect-error
        this.bits &= ~this.#reduce(bits);
        return this;
    }

    toggle(bits: BitField.BitLike<K, B>) {
        // @ts-expect-error
        this.bits ^= this.#reduce(bits);
        return this;
    }

    equals(bits: BitField.BitLike<K, B>) {
        return this.bits === this.#reduce(bits);
    }

    toArray(): K[] {
        return Object.keys((this.constructor as typeof BitField<K, B>).Flags)
            .filter((flag): flag is K => this.has(flag as K));
    }

    static readonly initialBits: number | bigint = 0;
    static readonly Flags: Record<string, number | bigint> = {};

    static reduce<B extends number | bigint>(flags: BitField.BitLike<string, B>): B {
        if (typeof flags === typeof this.initialBits)
            return flags as B;

        if (flags instanceof BitField)
            return flags.bits;

        if (typeof flags === 'string') {
            if (flags in this.Flags)
                return this.Flags[flags] as B;

            if (!isNaN(flags as any))
                return typeof this.initialBits === 'bigint' ? BigInt(flags) as B : Number(flags) as B;
        }

        if (Array.isArray(flags))
            // @ts-expect-error
            return flags.map(flag => this.reduce(flag)).reduce((a, b) => a | b, typeof this.initialBits === 'bigint' ? 0n : 0);

        throw RangeError('Flags out of range');
    }
}