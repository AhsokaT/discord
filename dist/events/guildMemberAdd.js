"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberAdd = void 0;
const framework_1 = require("@sapphire/framework");
class GuildMemberAdd extends framework_1.Listener {
    async run(member) {
        if (member.guild.id !== '509135025560616963' || member.user.bot)
            return;
        const channel = await member.guild.channels.fetch('961986228926963732');
        const commands = await member.guild.commands.fetch();
        const command = commands.find(({ name }) => name === 'choosehouse');
        channel.send({ content: `Welcome to Daily Offenders, ${member}! When you're ready, use ${command ? `</choosehouse:${command.id}>` : '`/choosehouse`'} to join a house and begin collecting points!` });
    }
}
exports.GuildMemberAdd = GuildMemberAdd;
framework_1.container.stores.loadPiece({
    piece: GuildMemberAdd,
    name: 'guildMemberAdd',
    store: 'listeners'
});
