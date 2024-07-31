import { Listener } from "@sapphire/framework";
import assert from "assert/strict";
import {
    APIEmbedField,
    ButtonStyle,
    ClientEvents,
    ComponentType,
    EmbedBuilder,
    Events,
} from "discord.js";
import yts from "yt-search";

export class MessageCreateListener extends Listener<Events.MessageCreate> {
    async run(...[message]: ClientEvents[Events.MessageCreate]) {
        if (message.author.bot) return;
        assert.ok(process.env.LOG_CHANNEL_ID);

        const youtubeRegex =
            /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/g;
        const urls = message.content.match(youtubeRegex);

        if (!urls) return;

        const channel = await message.client.channels.fetch(
            process.env.LOG_CHANNEL_ID
        );

        if (!channel?.isTextBased()) return;

        let embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .addFields({ name: "Message", value: message.url });

        let embeds: EmbedBuilder[] = [embed];
        let fields: APIEmbedField[] = [];

        for await (const video of this.parseVideos(message.content)) {
            console.log("video:", video.title);
            const uploadTimestamp = Date.parse(video.uploadDate);
            const uploadStr = !isNaN(uploadTimestamp)
                ? ` <t:${~~(uploadTimestamp / 1000)}:R> `
                : " ";

            fields.push({
                name: "Video",
                value: `[${video.title}](<${video.url}>)\n-# Uploaded${uploadStr}by [${video.author.name}](<${video.author.url}>)`,
            });
        }

        for await (const playlist of this.parsePlaylists(message.content)) {
            const createdTimestamp = Date.parse(playlist.date);
            const createdStr = !isNaN(createdTimestamp)
                ? ` <t:${~~(createdTimestamp / 1000)}:R> `
                : " ";

            fields.push({
                name: "Playlist",
                value: `[${playlist.title}](<${playlist.url}>)\n-# Created${createdStr}by [${playlist.author.name}](<${playlist.author.url}>)`,
            });
        }

        embed.addFields(fields.splice(0, 24));

        while (fields.length > 0) {
            embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setAuthor({
                    name: message.author.tag,
                })
                .addFields(fields.splice(0, 25));

            embeds.push(embed);
        }

        await channel.send({
            embeds,
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            emoji: "📌",
                            customId: "pin",
                            style: message.pinned
                                ? ButtonStyle.Danger
                                : ButtonStyle.Primary,
                        },
                    ],
                },
            ],
        });
    }

    async *parseVideos(str: string): AsyncGenerator<yts.VideoMetadataResult> {
        let x = new Set(this.parseVideoUrls(str));
        console.log("attempting to parse:", x);
        for (const url of x) {
            yield await yts({ videoId: this.parseYouTubeVideoId(url) });
        }
    }

    async *parsePlaylists(
        str: string
    ): AsyncGenerator<yts.PlaylistMetadataResult> {
        for (const url of new Set(this.parsePlaylistUrls(str)))
            yield await yts({ listId: this.parseYouTubePlaylistId(url) });
    }

    parseVideoUrls(str: string): string[] {
        const regex =
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g; // nosonar
        const matches = [];
        let match;
        while ((match = regex.exec(str)) !== null) {
            matches.push(match[0]);
        }
        return matches;
    }

    parsePlaylistUrls(str: string): string[] {
        const regex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/playlist\?list=)[a-zA-Z0-9_-]+(&.*)?$/;
        return regex.exec(str) ?? [];
    }

    parseYouTubeVideoId(url: string): string {
        console.log("Parsing:", url);
        const regex =
            /(?:v=|\/(?:vi|v|e|embed)\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = regex.exec(url);
        const id = match?.[1];
        assert.ok(id, TypeError(`Could not parse video ID from "${url}".`));
        return id;
    }

    parseYouTubePlaylistId(url: string): string {
        const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
        const match = regex.exec(url);
        const id = match?.[1];
        assert.ok(id, TypeError(`Could not parse playlist ID from "${url}".`));
        return id;
    }
}
