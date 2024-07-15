import { Subscription } from './Subscription.js';
import { Track } from './Track.js';

export class QueueMap extends Map<string, Track> {
    constructor(readonly subscription: Subscription) {
        super();
    }

    toArray() {
        return [...this.entries()];
    }

    shuffle() {
        const array = this.toArray();

        for (let i = 0; i < array.length; i++) {
            const j = ~~(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        this.clear();

        for (const [id, track] of array) this.set(id, track);
    }

    set(id: string, track: Track): this {
        super.set(id, track);

        this.subscription.messages.patch();

        return this;
    }

    delete(id: string): boolean {
        const deleted = super.delete(id);

        this.subscription.messages.patch();

        return deleted;
    }

    clear(): void {
        super.clear();

        this.subscription.messages.patch();
    }
}
