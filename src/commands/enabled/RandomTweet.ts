import Discord, { Message } from "discord.js";

import Core from "../../cores/Core";
import AbstractCommand from "../AbstractCommand";

export default class RandomTweet extends AbstractCommand {

    public constructor() {
        super("randomtweet", "duh", "usage");
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public called(core: Core, channel: string, args: string[]) : void {
        console.log("called randomtweet");
        // This command does not accept arguments
        // if (args !== []) {
        //     // Send usage
        // };
        const channelTarget = core.getBot().channels.get(channel);
        if (channelTarget !== undefined) {
            if (channelTarget.type == "dm" || channelTarget.type == "text") {
                channelTarget.send("This is not a tweet :thinking:");
                core.getTwitterInstance().getRandomTweet("Node.js", (tweet) => {
                    if (channel !== undefined) {
                       channelTarget.send(tweet);
                    }
                });
            }
        }
    }
}
