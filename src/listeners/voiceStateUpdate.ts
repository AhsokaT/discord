import { Events, Listener } from '@sapphire/framework';
import { VoiceState } from 'discord.js';
import { Client } from '../client/client.js';

export class VoiceStateUpdateListener extends Listener<typeof Events.VoiceStateUpdate> {
    public run(oldState: VoiceState, newState: VoiceState) {
        const subscription = (this.container.client as Client).subscriptions.get(oldState.guild.id);

        subscription && subscription.processVoiceStateUpdate(oldState, newState);
    }
}