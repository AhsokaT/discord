import { Message, PermissionFlagsBits } from 'discord.js';
import { Track } from '../structs/Track.ts';
import { Subscription } from '../structs/Subscription.ts';

export class SubscriptionMessageManager {
    public messageLock: boolean;
    public message: Message | null;

    constructor(readonly subscription: Subscription) {
        this.messageLock = false;
        this.message = null;
    }

    async patch() {
        if (this.messageLock || !this.message?.editable) return;

        this.messageLock = true;

        try {
            await this.message.edit({
                components: this.subscription.createMessageComponents(),
            });
        } catch (error) {
            console.error('Unable to patch message:', error);
        } finally {
            this.messageLock = false;
        }
    }

    async delete() {
        if (this.messageLock || !this.message?.deletable) return;

        this.messageLock = true;

        try {
            await this.message.delete();
            this.message = null;
        } catch (error) {
            console.error('Unable to delete message:', error);
        } finally {
            this.messageLock = false;
        }
    }

    async create(track: Track) {
        const hasPermissions = this.subscription.text
            .permissionsFor(this.subscription.client.user)
            ?.has([
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.EmbedLinks,
            ]);

        if (this.messageLock || this.message != null || !hasPermissions) return;

        this.messageLock = true;

        try {
            const commands = this.subscription.client.guildData.cache.get(
                this.subscription.guildId
            )?.commands;

            const embed = track.createEmbed({
                label: 'Now playing',
                relativeDuration: true,
                commandId:
                    commands &&
                    Array.from(commands.values()).find(
                        (command) => command.name === 'play'
                    )?.id,
                channelId: this.subscription.voice.id,
            });

            this.message = await this.subscription.text.send({
                embeds: [embed],
                components: this.subscription.createMessageComponents(),
            });
        } catch (error) {
            console.error('Unable to create message:', error);
        } finally {
            this.messageLock = false;
        }
    }
}
