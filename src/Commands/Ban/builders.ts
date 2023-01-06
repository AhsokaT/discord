import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const buildReasonModal = (member: GuildMember) => new ModalBuilder()
    .setTitle('Ban')
    .setCustomId(`BAN_${member.id}`)
    .addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('REASON')
                    .setPlaceholder(`Reason for ban`)
                    .setLabel(`Reason for banning ${member.user.tag}`)
                    .setMaxLength(512)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
            )
    );

export const buildBanRevokeButton = (banned: GuildMember) => new ButtonBuilder()
    .setCustomId(`UNBAN_${banned.id}`)
    .setLabel('Revoke ban')
    .setStyle(ButtonStyle.Primary);

export const buildBanEmbed = (banned: GuildMember, moderator: GuildMember) => new EmbedBuilder()
    .setColor('#2F3136')
    .setFooter({ text: `Banned user ID ${banned.user.id}\nModerator ID ${moderator.id}` })
    .setDescription(`**${banned.user.tag}** was **snapped** out of existence by ${moderator}`)
    .setImage('https://media.giphy.com/media/LOoaJ2lbqmduxOaZpS/giphy.gif?cid=ecf05e47gzp0mc04nqhf3ejthzmnd7vv3db10bzdq941ucfm&rid=giphy.gif&ct=g');