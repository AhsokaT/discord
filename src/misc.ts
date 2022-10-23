import { ActionRowBuilder, EmbedBuilder, Message, MessageActionRowComponentBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, Snowflake, TextChannel } from 'discord.js';
import { Client } from './client';
import { LeaderboardEmbed } from './Commands/builders';
import { RoleID } from './Commands/House/house';

export async function sendToLogChannel(client: Client, message: Parameters<TextChannel['send']>[0]): Promise<Message<true>> {
    return new Promise((res, rej) => {
        const channelID = process.env.AUDIT_CHANNEL;

        if (!channelID)
            return rej('process.env.AUDIT_CHANNEL is undefined.');

        client.channels.fetch(channelID)
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

export async function updateHousePoints(client: Client<true>, channelID: Snowflake, messageID: Snowflake): Promise<Message<true>> {
    return new Promise(async (res, rej) => {
        const channel = await client.channels.fetch(channelID);

        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');

        const message = await channel.messages.fetch(messageID).catch(console.debug);

        if (message)
            message.edit({ embeds: [LeaderboardEmbed(client.housePointManager.sorted)] }).then(res).catch(rej);
        else
            channel.send({ embeds: [LeaderboardEmbed(client.housePointManager.sorted)] }).then(res).catch(rej);
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

        const owner = await channel.guild.fetchOwner()
            .catch(console.debug);

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setDescription('🛕 Choose your house! This will let others know who you are, but most importantly it let\'s you know who YOU are and rep your house with the upmost respect!')
            .addFields(
                {
                    name: '🐯 House of Tiger',
                    value: `<@&${RoleID.TIGER}> Competitive, crud central, Fearless, Rage`
                },
                {
                    name: '🦉 100 Acre Wood',
                    value: `<@&${RoleID.OWL}> Observant, integrity, judge`
                },
                {
                    name: '👁️ The Ravens',
                    value: `<@&${RoleID.RAVEN}> The eye of all eyes, Pure Daily Offenders`
                },
                {
                    name: '🐢 Kame House',
                    value: `<@&${RoleID.TURTLE}> chill, perseverance, otaku, cosplay & hentai enthusiast! (LOT'S OF NOSE BLEEDS)`
                },
                {
                    name: '🐼 Bamboo Forest',
                    value: `<@&${RoleID.PANDA}> bashful, emotional, foodie, jokes, sleepy`
                }
            );

        if (owner)
            embed.setAuthor({ name: owner.user.tag, iconURL: owner.displayAvatarURL({ size: 4096 }) });

        const payload = {
            // embeds: [embed],
            embeds: [],
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