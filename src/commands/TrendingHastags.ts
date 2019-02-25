import Discord, { Message } from "discord.js";

import Core from "../cores/Core";
import AbstractCommand from "./AbstractCommand";

export default class TrendingHashtags extends AbstractCommand {

    public constructor() {
        super("trendinghashtags", "Get the trending tweets in a provided woeid"
        + "(can be found at http://woeid.rosselliot.co.nz/)", "% trendinghashtags [woeid]", 1);
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public async called(core: Core, message: Discord.Message, args: string[]): Promise<void> {
        await core.getTwitterManager().getTrendingHashtags(args[0], (hashtags: string[]) => {
            let desc: string = "";
            hashtags.forEach((tag) => {
                desc = desc.concat(`${tag}\n`);
            });
            message.channel.send({embed: {
                color: 3447003,
                description: desc,
              }});
        });
    }

}
