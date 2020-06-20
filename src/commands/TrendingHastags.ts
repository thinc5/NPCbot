import Discord from "discord.js";
import TwitterClient from "twitter";

import Core from "../cores/Core";
import AbstractCommand from "./AbstractCommand";

export default class TrendingHashtags extends AbstractCommand {

    public constructor() {
        super("trendinghashtags", "Get the trending tweets in a provided woeid"
        + "(can be found at http://woeid.rosselliot.co.nz/)", `${process.env.COMMAND_PREFIX} trendinghashtags [woeid]`, 1);
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public async called(core: Core, message: Discord.Message, args: string[]): Promise<void> {
        // Call api through twitter core
        await core.getTwitterManager().getTrendingTags(args[0])
        .then((data: TwitterClient.ResponseData) => {
            let desc = "";
            const trends: any[] = data[0].trends;
            trends.forEach((trend: any) => {
                desc = desc.concat(`${trend.name}\n`);
            });
            message.channel.send({embed: {
                color: 3447003,
                description: desc,
              }});
        })
        .catch((err) => {
            message.channel.send({embed: {
                color: 3447003,
                description: err,
            }});
        })
    }
}
