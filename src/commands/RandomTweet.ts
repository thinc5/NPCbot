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
        await core.getTwitterManager().getRandomTweet(args[0], (tweet, url, mediaUrl) => {
            if (message.channel !== undefined) {
                message.channel.send(new Discord.RichEmbed()
                    .setTitle(`Selected tweet from query: ${args[0]}`)
                    // .setAuthor("thinc5", "")
                    .setColor(0x00AE86)
                    .setDescription(`${tweet}`)
                    .setFooter(`Brought to you by the engineers at Dotma! (dotma.me)`)
                    .setImage(`${mediaUrl}`)
                    // .setThumbnail("http://i.imgur.com/p2qNFag.png")
                    .setTimestamp()
                    .setURL(`${url}`),
                    // .addField("This is a field title, it can hold 256 characters", "This is a field value, it can hold 1024 characters.")
                    // .addField("Inline Field", "They can also be inline.", true)
                    // .addBlankField(true)
                    // .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);
                );
            }
        });
    }

}
