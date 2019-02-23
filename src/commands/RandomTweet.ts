import Discord, { Message } from "discord.js";

import Core from "../cores/Core";
import AbstractCommand from "./AbstractCommand";

export default class RandomTweet extends AbstractCommand {

    public constructor() {
        super("randtweet", "duh", "% randtweet [query]", 1);
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public async called(core: Core, message: Discord.Message, args: string[]): Promise<void> {
        await core.getTwitterManager().getRandomTweet(args[0], (tweet) => {
            if (message.channel !== undefined) {
                message.channel.send(tweet);
            }
        });
    }

}
