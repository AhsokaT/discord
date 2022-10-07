import { PermissionsString, Interaction, CacheType } from 'discord.js';
import { Collection } from 'js-augmentations';
export declare class InteractionReceiver<Cached extends CacheType, I extends Interaction<Cached> = Interaction<Cached>> {
    readonly permissions: Collection<"CreateInstantInvite" | "KickMembers" | "BanMembers" | "Administrator" | "ManageChannels" | "ManageGuild" | "AddReactions" | "ViewAuditLog" | "PrioritySpeaker" | "Stream" | "ViewChannel" | "SendMessages" | "SendTTSMessages" | "ManageMessages" | "EmbedLinks" | "AttachFiles" | "ReadMessageHistory" | "MentionEveryone" | "UseExternalEmojis" | "ViewGuildInsights" | "Connect" | "Speak" | "MuteMembers" | "DeafenMembers" | "MoveMembers" | "UseVAD" | "ChangeNickname" | "ManageNicknames" | "ManageRoles" | "ManageWebhooks" | "ManageEmojisAndStickers" | "UseApplicationCommands" | "RequestToSpeak" | "ManageEvents" | "ManageThreads" | "CreatePublicThreads" | "CreatePrivateThreads" | "UseExternalStickers" | "SendMessagesInThreads" | "UseEmbeddedActivities" | "ModerateMembers">;
    constructor();
    addPermissions(...permissions: PermissionsString[]): this;
    receive(interaction: I): void;
}
