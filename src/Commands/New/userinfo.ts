import { ButtonBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonStyle, EmbedBuilder, GuildMember, Interaction, MessageActionRowComponentBuilder, PermissionFlagsBits, Snowflake, User, ApplicationCommandType } from 'discord.js';
import { RoleHouse, RoleID } from '../House/housePicker';
import { Command } from '../template';

const MENU = new ContextMenuCommandBuilder()
    .setName('Info')
    .setType(ApplicationCommandType.User);

const FLAG_EMOJIS = {
    'VerifiedDeveloper': '<:VERIFIED_DEVELOPER:766737559174119454>',
    'VerifiedBot': '<:VERIFIED_BOT:766737558896902155>',
    // 'SYSTEM': '<:SYSTEM:766737559128375386>',
    'Hypesquad': '<:HYPESQUAD_EVENTS:766737558842769428>',
    'HypeSquadOnlineHouse2': '<:HOUSE_BRILLIANCE:766737558834774097>',
    'HypeSquadOnlineHouse1': '<:HOUSE_BRAVERY:766737558595698688>',
    'HypeSquadOnlineHouse3': '<:HOUSE_BALANCE:766737558687973406>',
    'PremiumEarlySupporter': '<:EARLY_SUPPORTER:766737558205628427>',
    'Partner': '<:DISCORD_PARTNER:766737558176268299>',
    'Staff': '<:DISCORD_EMPLOYEE:766737557840199691>',
    'BugHunterLevel1': '<:BUGHUNTER_LEVEL_1:766737557672689664>',
    'BugHunterLevel2': '<:BUGHUNTER_LEVEL_2:766737557828141076>'
};

async function replyWithEmbed(target: User | GuildMember, interaction: Interaction) {
    if (!interaction.isRepliable())
        return;

    let user = target instanceof User ? target : target.user;
    let member = target instanceof GuildMember ? target : null;

    // if (user.id === '451448994128723978')
    //     return interaction.reply({ content: user.toString(), ephemeral: true, allowedMentions: { parse: [] } });

    let userInfo =
        `**\`• Username\`** ${user.tag}\n` +
        `**\`• ID\`** ${user.id}\n` +
        `**\`• Created\`** <t:${Math.round(user.createdTimestamp / 1000)}:R>`;

    if (member && member.guild.members.me?.permissions.has(PermissionFlagsBits.UseExternalEmojis) || !member) {
        try {
            let flags = user.flags ?? await user.fetchFlags();

            if ([...flags].length > 0)
                userInfo += `\n**\`• Badges\`** ${[...flags].map(flag => FLAG_EMOJIS[flag]).join(' ')}`;
        } catch (err) {
            console.debug(err);
        }
    }

    if (user.bot)
        userInfo += '\n**`• Account`** Bot';

    const embed = new EmbedBuilder()
        .setColor('#2F3136')
        .setDescription(user.toString())
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 4096 }) })
        .setThumbnail(user.displayAvatarURL({ size: 4096 }))
        .addFields({ name: 'User info', value: userInfo, inline: true });

    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('User avatar')
                .setStyle(ButtonStyle.Link)
                .setURL(user.displayAvatarURL({ size: 4096, extension: 'png' }))
        );

    if (member) {
        embed.setThumbnail(member.displayAvatarURL({ size: 4096 }));

        if (member.displayAvatarURL({ size: 4096 }) !== user.displayAvatarURL({ size: 4096 }))
            actionRow.addComponents(
                new ButtonBuilder()
                    .setLabel('Server avatar')
                    .setStyle(ButtonStyle.Link)
                    .setURL(member.displayAvatarURL({ size: 4096, extension: 'png' }))
            );

        let memberInfo = `**\`• Display name\`** ${member.displayName}`;
        let guild = member.guild;

        if (member.roles.cache.size > 1)
            memberInfo += `\n**\`• Roles\`** ${member.roles.cache.filter(role => role.id !== guild.id).map(role => role.toString()).join(' ')}`;

        if (member.joinedTimestamp)
            memberInfo += `\n**\`• Joined\`** <t:${Math.round(member.joinedTimestamp / 1000)}:R>`;

        embed.addFields({ name: 'Member info', value: memberInfo, inline: true });

        const houseRole = member.roles.cache.find(role => (Object.values(RoleID) as Snowflake[]).includes(role.id));

        if (houseRole)
            actionRow.addComponents(
                new ButtonBuilder()
                    .setLabel('House')
                    .setCustomId(`HOUSEINFO_${RoleHouse[houseRole.id]}`)
                    .setStyle(ButtonStyle.Secondary)
            );
    }

    return interaction.reply({
        ephemeral: true,
        embeds: [embed],
        components: actionRow.components.length === 0 ? [] : [actionRow],
        allowedMentions: { parse: [] },
        fetchReply: true
    });
}

export const USER_INFO_COMMAND = new Command()
    .addIdentifiers('Information', 'USERINFO', 'Info')
    .addGuilds('509135025560616963')
    .addBuilders(MENU)
    .onButton(async interaction => {
        let targetID = interaction.customId.split('_').pop();

        if (!targetID)
            return console.error(`Target ID not included in custom ID`);

        let target = await interaction.guild.members.fetch(targetID).catch(() => null) ?? await interaction.client.users.fetch(targetID).catch(() => null);

        if (!target)
            return void interaction.reply({ content: `User with ID **${targetID}** could not be fetched. The account may no longer exist`, ephemeral: true }).catch(console.debug);

        replyWithEmbed(target, interaction)
            .catch(console.debug);
    })
    .onUserContextMenuCommand(interaction => replyWithEmbed(interaction.targetMember, interaction).catch(console.debug));