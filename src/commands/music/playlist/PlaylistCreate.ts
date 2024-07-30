import { Command } from '@sapphire/framework';
import assert from 'assert/strict';
import { Database } from '../../../managers/Database.js';
import { PieceOptions } from '../../../util/util.js';

@PieceOptions({
    name: 'playlistcreate'
})
export class PlaylistCreate extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        assert.ok(interaction.inGuild());
        await interaction.deferReply({ ephemeral: true });

        await using db = await Database.connect(interaction.client);

        const doc = interaction.client.userCache.get(interaction.user.id) ??
            await db.createUserDocument(interaction.user.id);

        const name = interaction.options.getString('name', true);

        const exists = doc.playlists.some(playlist => playlist.name === name);

        if (exists)
            return interaction.editReply(`Playlist "${name}" already exists.`);

        await db.patchUserDocument(interaction.user.id, {
            playlists: [...doc.playlists, { name, tracks: [] }]
        });

        await interaction.editReply(`Playlist "${name}" created.`);
    }
}
