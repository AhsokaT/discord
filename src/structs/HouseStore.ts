import assert from 'assert/strict';
import { House } from '../util/enum.js';
import { DatabaseConnection } from './DatabaseConnection.js';
import { HousePointCache } from './HousePointCache.js';

export class HouseStore extends HousePointCache {
    async load() {
        await using connection = await DatabaseConnection.connect(this);

        await connection.fetch();

        assert(House.ids.every(id => this.has(id)), Error('Missing house points.'));
    }

    async patch(points: [id: House.id, points: number][]) {
        await using connection = await DatabaseConnection.connect(this);

        await connection.patch(points);
    }
}
