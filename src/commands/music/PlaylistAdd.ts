import { Subcommand } from '@sapphire/plugin-subcommands';
import { Database } from '../../managers/Database.js';
import assert from 'assert/strict';

export class PlaylistAdd extends Subcommand {
    async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction) {
        assert.ok(interaction.inGuild());

        await using db = await Database.connect();

        await db.create(interaction.guildId);
    }
}
