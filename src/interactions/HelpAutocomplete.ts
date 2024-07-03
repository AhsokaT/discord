import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import { Client } from '../client/client.js';
import { PieceOptions } from '../util/util.js';

@PieceOptions({ interactionHandlerType: InteractionHandlerTypes.Autocomplete })
export class UserInfo extends InteractionHandler {
    async run(interaction: AutocompleteInteraction) {
        if (!interaction.inGuild())
            return void interaction.respond([]);

        const client = interaction.client as Client;
        const guildData = client.guildData.cache.get(interaction.guildId) ?? await client.guildData.create(interaction.guildId);
        const focussed = interaction.options.getFocused();
    
        const memberPermissions = interaction.inCachedGuild() && interaction.member.permissions.bitfield || interaction.inRawGuild() && BigInt(interaction.member.permissions);
    
        let choices = Array.from(guildData.commands.values());
    
        if (typeof memberPermissions === 'bigint')
            choices = choices.filter(command => command.default_member_permissions == null || (BigInt(command.default_member_permissions) & memberPermissions) === BigInt(command.default_member_permissions));
    
        if (focussed)
            choices = choices.filter(command => command.name.startsWith(focussed));
    
        interaction.respond(choices.map(command => ({ name: command.name, value: command.id })));
    }

    parse(interaction: AutocompleteInteraction) {
        return interaction.commandName === 'help' ? this.some() : this.none();
    }
}