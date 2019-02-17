import * as Discord from "discord.js"

import Core from "../../cores/Core";
import AbstractCommand from "../AbstractCommand";

export class RandomTweet extends AbstractCommand {

    public constructor(call: string, description: string, usage: string) {
        super(call, description, usage);
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public called(core: Core, channelId: number, args: string[]) : void {
        // This command does not accept arguments
        if (args !== []) {
            // Send usage
        };
        const targetChannel: any = core.getBot().channels.get(String(channelId));
        core.getTwitterInstance().getRandomTweet("Node.js", (tweet) => {
            if (targetChannel !== undefined) {
                targetChannel.send(tweet);
            }
        });
    }
}
