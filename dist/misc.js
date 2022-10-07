"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHousePicker = exports.updateHousePoints = exports.logHousePointChange = void 0;
const discord_js_1 = require("discord.js");
const house_1 = require("./Commands/House/house");
async function logHousePointChange(client, change, house, points) {
    return new Promise(async (res, rej) => {
        const channel = await client.channels.fetch(process.env.AUDIT_CHANNEL);
        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');
        channel.send({ content: `**${points} points** ${change} ${change === 'assigned' ? 'to' : 'from'} **${house_1.House[house]}** <@&${house_1.RoleID[house]}>`, allowedMentions: { parse: [] } })
            .then(res)
            .catch(rej);
    });
}
exports.logHousePointChange = logHousePointChange;
function houseField(house, points) {
    return { name: house, value: `${points} points` };
}
async function updateHousePoints(client, channelID, messageID, points) {
    return new Promise(async (res, rej) => {
        const channel = await client.channels.fetch(channelID);
        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');
        const message = await channel.messages.fetch(messageID).catch(console.debug);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#2F3136')
            .addFields(...Object.keys(house_1.House).map(house => [house_1.House[house], points[house]]).sort((a, b) => b[1] - a[1]).map(data => houseField(...data)));
        if (message)
            message.edit({ embeds: [embed] }).then(res).catch(rej);
        else
            channel.send({ embeds: [embed] }).then(res).catch(rej);
    });
}
exports.updateHousePoints = updateHousePoints;
async function postHousePicker(client) {
    return new Promise(async (res, rej) => {
        const channel = await client.channels.fetch('961986228926963732')
            .catch(console.debug);
        if (!channel || !channel.isTextBased() || channel.isDMBased())
            return rej('Could not fetch channel');
        const message = await channel.messages.fetch('1025526259259822140')
            .catch(console.debug);
        const owner = await channel.guild.fetchOwner()
            .catch(console.debug);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#2F3136')
            .setDescription('🛕 Choose your house! This will let others know who you are, but most importantly it let\'s you know who YOU are and rep your house with the upmost respect!')
            .addFields({
            name: '🐯 House of Tiger',
            value: `<@&${house_1.RoleID.TIGER}> Competitive, crud central, Fearless, Rage`
        }, {
            name: '🦉 100 Acre Wood',
            value: `<@&${house_1.RoleID.OWL}> Observant, integrity, judge`
        }, {
            name: '👁️ The Ravens',
            value: `<@&${house_1.RoleID.RAVEN}> The eye of all eyes, Pure Daily Offenders`
        }, {
            name: '🐢 Kame House',
            value: `<@&${house_1.RoleID.TURTLE}> chill, perseverance, otaku, cosplay & hentai enthusiast! (LOT'S OF NOSE BLEEDS)`
        }, {
            name: '🐼 Bamboo Forest',
            value: `<@&${house_1.RoleID.PANDA}> bashful, emotional, foodie, jokes, sleepy`
        });
        if (owner)
            embed.setAuthor({ name: owner.user.tag, iconURL: owner.displayAvatarURL({ size: 4096 }) });
        const payload = {
            // embeds: [embed],
            embeds: [],
            content: '**Choose your house below**',
            allowedMentions: { parse: [] },
            components: [
                new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.SelectMenuBuilder()
                    .setCustomId('HOUSE')
                    .setPlaceholder('Choose your house!')
                    .addOptions(new discord_js_1.SelectMenuOptionBuilder()
                    .setLabel('House of Tiger')
                    .setValue('TIGER')
                    .setEmoji('🐯')
                    .setDescription('Competitive, crud central, Fearless, Rage'), new discord_js_1.SelectMenuOptionBuilder()
                    .setLabel('100 Acre Wood')
                    .setValue('OWL')
                    .setEmoji('🦉')
                    .setDescription('Observant, integrity, judge'), new discord_js_1.SelectMenuOptionBuilder()
                    .setLabel('The Ravens')
                    .setValue('RAVEN')
                    .setEmoji('👁️')
                    .setDescription('The eye of all eyes, Pure Daily Offenders'), new discord_js_1.SelectMenuOptionBuilder()
                    .setLabel('Kame House')
                    .setValue('TURTLE')
                    .setEmoji('🐢')
                    .setDescription('chill, perseverance, otaku, cosplay & hentai enthusiast!'), new discord_js_1.SelectMenuOptionBuilder()
                    .setLabel('Bamboo Forest')
                    .setValue('PANDA')
                    .setEmoji('🐼')
                    .setDescription('bashful, emotional, foodie, jokes, sleepy')))
            ]
        };
        if (message)
            message.edit(payload).then(res).catch(rej);
        else
            channel.send(payload).then(res).catch(rej);
    });
}
exports.postHousePicker = postHousePicker;
