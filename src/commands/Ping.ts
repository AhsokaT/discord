import { ApplyOptions } from '@sapphire/decorators';
import { Command, container } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
    name: 'ping',
    description: 'Ping pong!'
})
export class Ping extends Command {
    async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const reply = await interaction.deferReply({ ephemeral: true, fetchReply: true });

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`:ping_pong: **Pong!** \`Client ${ping}ms\` \`Websocket ${interaction.client.ws.ping}ms\``).catch(console.error);
    }

    registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand({ name: this.name, description: this.description }, { guildIds: ['509135025560616963'] });
    }
}

container.stores.loadPiece({
    piece: Ping,
    name: 'Ping',
    store: 'commands'
});