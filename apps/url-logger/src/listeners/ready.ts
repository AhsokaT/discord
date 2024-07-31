import { Listener } from "@sapphire/framework";
import { Client, Events } from "discord.js";

export class ReadyListener extends Listener<Events.ClientReady> {
    run(ready: Client<true>) {
        console.log(`Logged in as ${ready.user.tag}`);
    }
}
