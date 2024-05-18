import { ActionRowBuilder, Message, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Client } from './Client/client';
import { House } from './Util/enum';

export async function postHousePicker(client: Client<true>) {
    return new Promise<Message<true>>(async (res, rej) => {
        const channel = await client.channels.fetch('961986228926963732')
            .catch(console.debug);

        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');

        const message = await channel.messages.fetch('1025526259259822140')
            .catch(console.debug);

        const payload = {
            content: '**Choose your house below**',
            allowedMentions: { parse: [] },
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('HOUSE')
                            .setPlaceholder('Choose your house!')
                            .addOptions(
                                House.ALL.map(
                                    house => new StringSelectMenuOptionBuilder()
                                        .setLabel(house.name)
                                        .setEmoji(house.emoji)
                                        .setDescription(house.description)
                                        .setValue(house.id)
                                )
                            )
                    )
            ]
        };

        if (message)
            message.edit(payload).then(res).catch(rej);
        else
            channel.send(payload).then(res).catch(rej);
    });
}