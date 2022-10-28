import { ActionRowBuilder, Message, MessageActionRowComponentBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, TextChannel, Client as DJSClient } from 'discord.js';
import { Client } from './client';

export async function sendToLogChannel(client: DJSClient, message: Parameters<TextChannel['send']>[0]): Promise<Message<true>> {
    return new Promise((res, rej) => {
        client.channels.fetch('1025143957186941038')
            .then(channel => {
                if (!channel)
                    return rej('Channel could not be fetched');

                if (!channel.isTextBased() || channel.isDMBased())
                    return rej('Channel was not text-based or channel was DM-based.');

                channel.send(message).then(res);
            })
            .catch(rej);
    });
}

export async function postHousePicker(client: Client<true>): Promise<Message<true>> {
    return new Promise(async (res, rej) => {
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
                                    .setLabel('House of Tiger')
                                    .setValue('TIGER')
                                    .setEmoji('🐯')
                                    .setDescription('Competitive, crud central, Fearless, Rage'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('100 Acre Wood')
                                    .setValue('OWL')
                                    .setEmoji('🦉')
                                    .setDescription('Observant, integrity, judge'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('The Ravens')
                                    .setValue('RAVEN')
                                    .setEmoji('👁️')
                                    .setDescription('The eye of all eyes, Pure Daily Offenders'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('Kame House')
                                    .setValue('TURTLE')
                                    .setEmoji('🐢')
                                    .setDescription('chill, perseverance, otaku, cosplay & hentai enthusiast!'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('Bamboo Forest')
                                    .setValue('PANDA')
                                    .setEmoji('🐼')
                                    .setDescription('bashful, emotional, foodie, jokes, sleepy')
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