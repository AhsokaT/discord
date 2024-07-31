import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonInteraction, ButtonStyle, ComponentType } from 'discord.js';

export class PauseButton extends InteractionHandler {
    constructor(ctx: InteractionHandler.LoaderContext) {
        super(ctx, {
            interactionHandlerType: InteractionHandlerTypes.Button,
        });
    }

    async run(interaction: ButtonInteraction) {
        await interaction.deferUpdate();

        const pinned = interaction.message.pinned;
        const reason = `${pinned ? 'Upinned' : 'Pinned'} by ${interaction.user.tag}`;
        const updated = await interaction.message[pinned ? 'unpin' : 'pin'](reason);
        const components = [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        emoji: '📌',
                        customId: 'pin',
                        style: updated.pinned
                            ? ButtonStyle.Secondary
                            : ButtonStyle.Primary,
                    },
                ],
            },
        ] as const;
        await interaction.editReply({ components });
    }

    parse(interaction: ButtonInteraction) {
        return interaction.customId === 'pin' ? this.some() : this.none();
    }
}
