import { Snowflake } from 'discord.js';
import { Subscription } from '../structs/Subscription.js';

export enum PassedVote {
    Skip,
    Disconnect,
    Stop
}

export class SubscriptionVoteManager {
    readonly stop: Set<Snowflake>;
    readonly skip: Set<Snowflake>;
    readonly disconnect: Set<Snowflake>;

    constructor(readonly subscription: Subscription) {
        this.stop = new Set();
        this.skip = new Set();
        this.disconnect = new Set();
    }

    get voters() {
        return this.subscription.voice.members.filter(member => !member.user.bot);
    }

    get neededVotes() {
        return ~~(this.voters.size / 2);
    }

    clear() {
        this.stop.clear();
        this.skip.clear();
        this.disconnect.clear();
    }

    processVotes() {
        if (this.stop.size > 0 && this.stop.size >= this.neededVotes) {
            this.stop.clear();
            this.subscription.stop();

            return PassedVote.Stop;
        }

        if (this.skip.size > 0 && this.skip.size >= this.neededVotes) {
            this.skip.clear();
            this.subscription.player.stop();

            return PassedVote.Skip;
        }

        if (this.disconnect.size > 0 && this.disconnect.size >= this.neededVotes) {
            this.disconnect.clear();
            this.subscription.stop(true);

            return PassedVote.Disconnect;
        }

        return null;
    }

    castSkip(user: Snowflake) {
        if (this.skip.has(user))
            this.skip.delete(user);
        else
            this.skip.add(user);

        return this.processVotes() === PassedVote.Skip;
    }

    castStop(user: Snowflake) {
        if (this.stop.has(user))
            this.stop.delete(user);
        else
            this.stop.add(user);

        return this.processVotes() === PassedVote.Stop;
    }

    castDisconnect(user: Snowflake) {
        if (this.disconnect.has(user))
            this.disconnect.delete(user);
        else
            this.disconnect.add(user);

        return this.processVotes() === PassedVote.Disconnect;
    }
}