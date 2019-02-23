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
    public async called(core: Core, channel: string, args: string[]): Promise<void> {
        console.log("called lahastags");
        const channelTarget: Discord.TextChannel = core.getBot().channels.get(channel) as Discord.TextChannel;
        if (channelTarget !== undefined) {
            if (channelTarget.type === "text") {
                await core.getTwitterManager().getLaHashtags();
            }
        }
    }

}
