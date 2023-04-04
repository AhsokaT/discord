"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildMemberAdd = void 0;
const discord_js_1 = require("discord.js");
const ClientEvent_1 = require("./ClientEvent");
exports.guildMemberAdd = new ClientEvent_1.ClientEvent('guildMemberAdd', async (member) => {
    const channel = await member.client.channels.fetch('1017094377690108046');
    if (channel && channel.isTextBased())
        channel.send({
            content: `Welcome ${member}`,
            components: [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setLabel('Choose house')
                    .setCustomId('SETUP')
                    .setStyle(discord_js_1.ButtonStyle.Primary))
            ]
        }).then(m => setTimeout(() => m.delete(), 10000));
    // const embed = new EmbedBuilder()
    //     .setColor('#2F3136')
    //     .setTitle('Member joined')
    //     .setAuthor({ name: member.user.tag })
    //     .addFields(
    //         { name: 'Member', value: member.toString(), inline: true },
    //         { name: 'Joined', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
    //     );
    // (member.client as Client).sendToLogChannel({
    //     embeds: [embed],
    //     components: [
    //         new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(UserInfoButton(member.user.id))
    //     ],
    //     allowedMentions: { parse: [] }
    // })
    // .catch(console.debug);
});
