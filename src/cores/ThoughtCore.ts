const Chain: any = require("markovchain");

import TwitterClient from "twitter";

import Core from "./Core";

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
        this.progress = 55;
    }

    /**
     * Start thinking when core is ready.
     */
    public start(): void {
        // Status and avatar updates
        setInterval(() => {
            this.progressUpdate();
        }, 1000 * 4);   // Only update every 4 seconds.
        setInterval(() => {
            this.avatarUpdate();
        }, (1000 * 60 * 30)); // Only update every 30 minutes.
        // Thinking updates every four hours
        setInterval(() => { // Update DB every four hours.
            this.retrieveMaterial();
        }, (1000 * 60 * 60 * 4));
        setInterval(() => {
            this.giveOpinion();
        }, (1000 * 60 * 60 * 24));
    }

    /**
     * Private retrieval of unrelated materials.
     * TODO: Hard coded for LA right now, will have it be customizable by server eventually.
     */
    public async retrieveMaterial(): Promise<void> {
        let trends: string[] = [];
        await this.core.getTwitterManager().getTrendingTags("2442047")
        .then((tags: TwitterClient.ResponseData) => {
            let desc = "";
            const rawTrends = tags[0].trends;
            rawTrends.slice(0, 2);
            rawTrends.forEach((trend: any) => {
                trends.push(`${trend.name}`);
            });
        })
        .catch((err) => {
            console.error(err);
        });
        if (trends === []) {
            console.error("Failed to gather trends.");
            return;
        }
        await this.core.getTwitterManager().getMaterialByTweet(trends)
        .then((data) => {
            this.core.getDBCore().storeTweets(data);
        })
        .catch((err) => {
            console.error(err);
        });
    }

    /**
     * Give current opinion and forget everything else.
     */
    public giveOpinion(): void {
        // Get opinion.
        this.processMaterial();
        // Forget everything.
        this.core.getDBCore().forgetTweets();
    }

    /**
     * Think time...
     */
    private processMaterial(): void {
        // Get stored tweets.
        this.core.getDBCore().retrieveTweets()
        .then((data) => {
            const quotes = new Chain(data.join("\n"));
            const tweet = quotes.start((wordList: any) => {
                const tempList = Object.keys(wordList);
                return tempList[Math.random() * (tempList.length - 1)]
            })
            .end(50)
            .process();
            console.log(tweet);
        })
        .catch((err) => {
            console.error(err);
        });
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
            this.core.updateActivity(`% help`);
        }, 2000);
    }

    /**
     * Update bots avatar based off status.
     */
    private avatarUpdate(): void {
        if (this.progress < 50) {
            this.core.updateAvatar("res/main.png");
        } else if (this.progress < 60) {
            this.core.updateAvatar("res/soy.png");
        } else if (this.progress < 80) {
            this.core.updateAvatar("res/smug.png");
        } else {
            this.core.updateAvatar("res/angry.png");
        }
    }

}
