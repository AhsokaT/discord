import { Track } from './Track.js';

export class Queue extends Array<Track> {
    shuffle() {
        for (let i = 0; i < this.length; i++) {
            const j = ~~(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }

    toDurationString() {
        const ms =
            this.reduce((acc, curr) => acc + curr.video.duration.seconds, 0) *
            1000;
        return new Date(ms).toISOString().slice(11, 19);
    }

    toTimeString() {
        let timeString = this.toDurationString();
        return timeString.startsWith('00:') ? timeString.slice(3) : timeString;
    }
}
