import { Events, Listener, container } from '@sapphire/framework';
import { GuildMember, TextChannel } from 'discord.js';

export class GuildMemberAdd extends Listener<typeof Events.GuildMemberAdd> {
    async run(member: GuildMember) {
        if (member.guild.id !== '509135025560616963' || member.user.bot)
            return;

        const channel = await member.guild.channels.fetch('961986228926963732') as TextChannel;
        const commands = await member.guild.commands.fetch();
        const command = commands.find(({ name }) => name === 'choosehouse');

        channel.send({ content: `Welcome to Daily Offenders, ${member}! When you're ready, use ${command ? `</choosehouse:${command.id}>` : '`/choosehouse`'} to join a house and begin collecting points!` });
    }
}

container.stores.loadPiece({
    piece: GuildMemberAdd,
    name: 'guildMemberAdd',
    store: 'listeners'
});