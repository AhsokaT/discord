import { Events, Listener } from '@sapphire/framework';
import { VoiceState } from 'discord.js';

export class VoiceStateUpdateListener extends Listener<
    typeof Events.VoiceStateUpdate
> {
    public run(oldState: VoiceState, newState: VoiceState) {
        const client = this.container.client;
        const subscription = client.subscriptions.get(oldState.guild.id);

        subscription?.onVoiceStateUpdate(oldState, newState);
    }
}
