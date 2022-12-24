import { TypedEmitter } from '../../../TypedEmitter';
import { House } from './housePicker';
import { Client } from '../../client';

export type HouseID =
    | 'TIGER'
    | 'OWL'
    | 'RAVEN'
    | 'TURTLE'
    | 'PANDA';

export type HousePoints = Record<HouseID, number>;

export interface HousePointManagerEvent {
    update: (points: HousePoints) => void;
}

export class HousePointManager extends TypedEmitter<HousePointManagerEvent> {
    public cache: HousePoints;
    public clientStatus: 'connected' | 'disconnected' = 'disconnected';

    constructor(readonly client: Client) {
        super();

        this.client = client;
        this.cache = { OWL: 0, PANDA: 0, TIGER: 0, RAVEN: 0, TURTLE: 0 };
        this.initCache()
            .catch(console.debug);
    }

    async initCache() {
        this.cache = await this.client.database.fetchAll();

        return this.cache;
    }

    async addPoints(house: HouseID, points: number, closeConnection = true) {
        await this.client.database.edit(house, { points: this.cache[house] + points }, closeConnection);

        this.cache[house] += points;

        return this.cache;
    }

    get sorted() {
        return Object.keys(House).map(name => [name, this.cache[name]] as [string, number]).sort((a, b) => b[1] - a[1]);
    }
}