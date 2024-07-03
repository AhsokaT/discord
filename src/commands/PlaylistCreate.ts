import { PieceOptions } from '../util/util.js';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Client } from '../client/client.js';

export interface PlaylistDocument {
    name: string;
    tracks: string[];
}

export interface UserDocument {
    _id: string;
    playlists: PlaylistDocument[];
}

@PieceOptions({
    name: 'playlist',
    subcommands: [
        {
            name: 'create',
            chatInputRun: 'chatInputRunCreate'
        }
    ]
})
export class PlaylistCommand extends Subcommand {
    async chatInputRunCreate(interaction: Subcommand.ChatInputCommandInteraction) {
        const client = interaction.client as Client<true>;

        client.guildData.mongo.db('Arcane').collection<UserDocument>('Users');
    }
}