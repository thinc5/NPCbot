import Discord, { Message } from "discord.js";

import Core from "../cores/Core";
import AbstractCommand from "./AbstractCommand";

export default class Register extends AbstractCommand {

    public constructor() {
        super("register", "duh", `${process.env.COMMAND_PREFIX} register`, 0);
    }

    /**
     * Register a channel to NPCbot
     * @param channelId to send response to.
     * @param args of argument.
     */
    public async called(core: Core, message: Discord.Message, args: string[]): Promise<void> {
        // Check if user has administrator access.
        if (!message.member.permissions.has("MANAGE_GUILD")) {
            message.channel.send("User does not have required privileges.");
            return;
        }
        await core.getDBCore().registerChannel(message.channel.id)
        .then(() => {
            message.channel.send("Channel registered!");
        })
        .catch((err) => {
            message.channel.send(`Unable to register channel: ${err}`);
        });
    }

}
