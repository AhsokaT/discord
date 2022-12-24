import { ActionRowBuilder, Message, MessageActionRowComponentBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import { Client } from './client';
import { House, HouseDescription, HouseEmoji } from './Commands/House/housePicker';

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
                        new SelectMenuBuilder()
                            .setCustomId('HOUSE')
                            .setPlaceholder('Choose your house!')
                            .addOptions(
                                new SelectMenuOptionBuilder()
                                    .setLabel(House.TIGER)
                                    .setValue('TIGER')
                                    .setEmoji(HouseEmoji.TIGER)
                                    .setDescription(HouseDescription.TIGER),
                                new SelectMenuOptionBuilder()
                                    .setLabel(House.OWL)
                                    .setValue('OWL')
                                    .setEmoji(HouseEmoji.OWL)
                                    .setDescription(HouseDescription.OWL),
                                new SelectMenuOptionBuilder()
                                    .setLabel(House.RAVEN)
                                    .setValue('RAVEN')
                                    .setEmoji(HouseEmoji.RAVEN)
                                    .setDescription(HouseDescription.RAVEN),
                                new SelectMenuOptionBuilder()
                                    .setLabel(House.TURTLE)
                                    .setValue('TURTLE')
                                    .setEmoji(HouseEmoji.TURTLE)
                                    .setDescription(HouseDescription.TURTLE),
                                new SelectMenuOptionBuilder()
                                    .setLabel(House.PANDA)
                                    .setValue('PANDA')
                                    .setEmoji(HouseEmoji.PANDA)
                                    .setDescription(HouseDescription.PANDA)
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