// @ts-ignore
const Chain = require("markovchain");

import Discord, { DMChannel, TextChannel } from "discord.js";
import TwitterClient from "twitter";
import { CronJob }  from "cron";

import Core from "./Core";
import { TweetData } from "../../types/TweetData";

/**
 * @classdesc Facilitates original thought :^)
 */
export default class ThoughtCore {

    /**
     * Reference to core.
     */
    private core: Core;

    /**
     * Current progress to thought completion.
     */
    private progress: number;

    public constructor(core: Core) {
        this.core = core;
        this.progress = 0;
    }

    /**
     * Start thinking when core is ready.
     * TODO: Change to be crons running on UTC.
     */
    public start(): void {
        // Status and avatar updates this.interval / 100
        new CronJob("*/14 * * * *", () => {
            this.progress++;
        }, null, true, 'Australia/Brisbane');
        // Cant specify seconds in cron so we use an interval here.
        setInterval(() => {
            this.progressUpdate();
        }, 5000);
        new CronJob('30 * * * *', () => {
            this.avatarUpdate();
        }, null, true, 'Australia/Brisbane');
        new CronJob('0 */4 * * *', () => {
            this.retrieveMaterial();
        }, null, true, 'Australia/Brisbane', null, true);
        new CronJob("0 0 * * *", () => {
            this.giveOpinion();
            this.progress = 0;
        }, null, true, 'Australia/Brisbane', null, false);
    }

    /**
     * Private retrieval of unrelated materials.
     * TODO: Hard coded for LA right now, will have it be customizable by server eventually.
     */
    public async retrieveMaterial(): Promise<void> {
        try {
            const trends: string[] = [];
            const results: TwitterClient.ResponseData = await this.core.getTwitterManager().getTrendingTags("2442047");
            const rawTrends = (results[0].trends).slice(0, parseInt(process.env.NUMBER_OF_HASHTAGS as string, 10));
            rawTrends.forEach((trend: any) => {
                trends.push(`${trend.name}`);
            });
            if (trends === []) {
                console.error("Failed to gather trends.");
                return;
            }
            const data: TweetData[] = await this.core.getTwitterManager().getMaterialByTweet(trends);
            await this.core.getDBCore().storeTweets(data);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Give current opinion and forget everything else.
     */
    public async giveOpinion(): Promise<void> {
        // Get opinion.
        const tweet = await this.processMaterial();
        // Let all registered channels know.
        const targets: string[] = await this.core.getDBCore().getRegisteredChannels();
        for (const target of targets) {
            const channel: Discord.Channel | undefined = this.core.getBot().channels.get(target);
            if (channel !== undefined && channel.type === "text") {
                const dm = channel as Discord.TextChannel;
                const embed: Discord.RichEmbed = new Discord.RichEmbed();
                embed.setTitle(`This is my unique opinion: `)
                .setColor(0x00AE86)
                .setDescription(tweet)
                .setFooter(`Brought to you by the engineers at Dotma! (dotma.me)`)
                .setTimestamp()
                .setURL("https://www.dotma.me");
                dm.send(embed);
            }
        }
        // Clear the database
        await this.core.getDBCore().forgetTweets();
    }

    /**
     * Think time...
     */
    private async processMaterial(): Promise<string> {
        // Get stored tweets.
        const raw: string[] = await this.core.getDBCore().retrieveTweets();
        // Remove all newlines, and quotes.
        const words: string[] = (raw.join(" ").replace(/\n/g, "").replace(/"/g, "")).split(" ");
        // Get the starting word of the tweet to generate.
        const index: number = Math.floor(Math.random() * (words.length - 1));
        const start: string = words[index];
        // Instantiate the markov chain and parse the total words as a string.
        const quotes = new Chain(words.join(" "));
        return quotes.start(start).end(50).process();
    }

    /**
     * Update the bot's status.
     */
    private progressUpdate(): void {
        let bar = "..........";
        const base = "##########";
        const bars = Math.floor(this.progress / 10);
        bar = base.substr(0, bars) + bar.substr(bars);
        this.core.updateActivity(`[${bar}] ${this.progress}%`);
        setTimeout(() => {
            this.core.updateActivity(`${process.env.COMMAND_PREFIX} help`);
        }, 2000);
    }

    /**
     * Update bots avatar based off status.
     */
    private avatarUpdate(): void {
        if (this.progress < 15) {
            this.core.updateAvatar("res/thinking.png");
        } else if (this.progress < 30) {
            this.core.updateAvatar("res/sonk.png");
        } else if (this.progress < 45) {
            this.core.updateAvatar("res/thinkeye.png");
        } else if (this.progress < 60) {
            this.core.updateAvatar("res/megathink.png");
        } else if (this.progress < 75) {
            this.core.updateAvatar("res/thinksweat.png");
        } else {
            this.core.updateAvatar("res/thinkjoi.png");
        }
    }

}
