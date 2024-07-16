import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import {
    ApplicationCommand,
    ApplicationCommandOption,
    ApplicationCommandOptionType,
    ApplicationCommandSubCommand,
    ApplicationCommandSubGroup,
    ApplicationCommandType,
    AutocompleteInteraction,
} from 'discord.js';
import { PieceOptions } from '../util/util.js';
import assert from 'assert/strict';

type CommandInfo = [id: string, name: string];

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Autocomplete })
export class UserInfo extends InteractionHandler {
    async run(interaction: AutocompleteInteraction) {
        assert.ok(interaction.inGuild());

        const client = interaction.client;
        const guildData =
            client.guildData.cache.get(interaction.guildId) ??
            (await client.guildData.create(interaction.guildId));
        const focused = interaction.options.getFocused();
        let guild = interaction.guild;

        try {
            guild ??= await client.guilds.fetch(interaction.guildId);
        } catch {
            return interaction.respond([]);
        }

        const memberPermissions =
            (interaction.inCachedGuild() &&
                interaction.member.permissions.bitfield) ||
            (interaction.inRawGuild() &&
                BigInt(interaction.member.permissions));

        const commands = await guild.commands.fetch();

        this.walk(commands.values());

        let choices = Array.from(guildData.commands.values());

        if (typeof memberPermissions === 'bigint')
            choices = choices.filter(
                (command) =>
                    command.default_member_permissions == null ||
                    (BigInt(command.default_member_permissions) &
                        memberPermissions) ===
                        BigInt(command.default_member_permissions)
            );

        if (focused)
            choices = choices.filter((command) =>
                command.name.startsWith(focused)
            );

        interaction.respond(
            choices.map((command) => ({
                name: command.name,
                value: command.id,
            }))
        );
    }

    *walk(
        commands:
            | Iterable<ApplicationCommand>
            | Iterable<ApplicationCommandSubGroup>
            | Iterable<ApplicationCommandSubCommand>
    ): Generator<[id: string, name: string]> {
        for (const command of commands) {
            if (!command.options) continue;

            for (const option of command.options) {
                if (
                    option.type === ApplicationCommandOptionType.SubcommandGroup
                )
                    if (option.options)
                        yield* this.walk(option.options.slice());

                if (option.type === ApplicationCommandOptionType.Subcommand)
                    yield [option.name, option.name];
            }
        }
    }

    parse(interaction: AutocompleteInteraction) {
        return interaction.commandName === 'help' ? this.some() : this.none();
    }
}
