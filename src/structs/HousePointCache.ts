import assert from 'assert/strict';
import { House } from '../util/enum.js';

export class HousePointCache extends Map<House.id, number> {
    get(id: House.id): number {
        const holds = super.get(id);

        assert(typeof holds === 'number', Error('Missing house points.'));

        return holds;
    }

    set(id: House.id, points: number): this {
        return super.set(id, points);
    }

    position(id: House.id): number {
        return this.toSorted().findIndex(([name]) => name === id) + 1;
    }

    toSorted() {
        return House.ids
            .map((name) => [name, this.get(name)] as const)
            .sort(([, a], [, b]) => b - a);
    }

    copy() {
        return new HousePointCache(this);
    }
}
