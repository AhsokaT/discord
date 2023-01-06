import { ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js";
import { Client } from "../client";
import { RevokeBanButton, UserInfoButton } from "../Commands/builders";
import { ClientEvent } from "./ClientEvent";

export const guildBanAdd = new ClientEvent('guildBanAdd', ban => {
    const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle('Ban add')
        .setAuthor({ name: ban.user.tag })
        .addFields(
            { name: 'User', value: ban.user.toString(), inline: true },
            { name: 'Time', value: `<t:${Math.round(Date.now() / 1000)}:R>`, inline: true }
        );

    if (ban.reason)
        embed.addFields({ name: 'Reason', value: ban.reason, inline: true });

    (ban.client as Client).sendToLogChannel({
        embeds: [embed],
        components: [
            new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(UserInfoButton(ban.user.id), RevokeBanButton(ban.user.id)),
        ],
        allowedMentions: { parse: [] }
    })
    .catch(console.debug);
});