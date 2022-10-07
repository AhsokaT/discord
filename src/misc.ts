import { ActionRowBuilder, EmbedBuilder, Message, MessageActionRowComponentBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, Snowflake } from 'discord.js';
import { Client } from './client';
import { House, RoleID } from './Commands/House/house';
import { HousePoints } from './Commands/House/HousePointManager';

function houseField(house: string, points: number) {
    return { name: house, value: `${points} points` };
}

export async function updateHousePoints(client: Client<true>, channelID: Snowflake, messageID: Snowflake, points: HousePoints): Promise<Message<true>> {
    return new Promise(async (res, rej) => {
        const channel = await client.channels.fetch(channelID);

        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');

        const message = await channel.messages.fetch(messageID).catch(console.debug);

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .addFields(...Object.keys(House).map(house => [House[house], points[house]] as [string, number]).sort((a, b) => b[1] - a[1]).map(data => houseField(...data)));

        if (message)
            message.edit({ embeds: [embed] }).then(res).catch(rej);
        else
            channel.send({ embeds: [embed] }).then(res).catch(rej);
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
        }

        if (message)
            message.edit(payload).then(res).catch(rej);
        else
            channel.send(payload).then(res).catch(rej);
    });
}