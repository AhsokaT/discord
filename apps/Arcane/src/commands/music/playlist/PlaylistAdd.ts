import { Command } from '@sapphire/framework';
import assert from 'assert/strict';
import yts from 'yt-search';
import { Database } from '../../../managers/Database.js';
import { PieceOptions } from '../../../util/util.js';

@PieceOptions({
    name: 'playlistadd'
})
export class PlaylistAdd extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        assert.ok(interaction.inGuild());
        await interaction.deferReply({ ephemeral: true });

        const playlist = interaction.options.getString('playlist', true);
        const track = interaction.options.getString('track', true);
        const search = await yts(track);
        const video = search.videos[0];

        if (!video)
            return interaction.editReply('No videos found.');

        await using db = await Database.connect(interaction.client);

        const doc = interaction.client.userCache.get(interaction.user.id) ??
            await db.createUserDocument(interaction.user.id);

        
    }
}
