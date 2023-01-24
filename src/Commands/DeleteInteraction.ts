import { Command } from './template';

export const DELETE_INTERACTION = new Command()
    .addIdentifiers('DELETEINTERACTION')
    .onButton(i => i.message.delete().catch(console.debug));