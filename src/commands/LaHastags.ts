import Discord, { Message } from "discord.js";

import Core from "../cores/Core";
import AbstractCommand from "./AbstractCommand";

export default class LaHashtag extends AbstractCommand {

    public constructor() {
        super("lahashtags", "duh", "% lahashtags", 0);
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public async called(core: Core, message: Discord.Message, args: string[]): Promise<void> {
        await core.getTwitterManager().getLaHashtags((hashtags) => {
            message.channel.send({embed: {
                color: 3447003,
                description: hashtags,
              }});
        });
    }

}
