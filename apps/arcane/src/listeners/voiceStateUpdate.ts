import { Listener } from '@sapphire/framework';
import { ClientEvents, Events } from 'discord.js';

export class VoiceStateUpdateListener extends Listener<Events.VoiceStateUpdate> {
    public run(...[oldState, newState]: ClientEvents[Events.VoiceStateUpdate]) {
        const client = this.container.client;
        const subscription = client.subscriptions.get(oldState.guild.id);

        subscription?.onVoiceStateUpdate(oldState, newState);
    }
}
