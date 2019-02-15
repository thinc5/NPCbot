import TwitterClient, { ResponseData } from "twitter";

export default class CoreTwitter {

    private instance: TwitterClient;

    public constructor() {
        this.instance =  new TwitterClient({
            consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
            bearer_token: process.env.TWITTER_BEARER_TOKEN as string,
          });
    }

    /**
     * Get a random tweet from twitter with provided hashtag.
     * @param object params,
     */
    public getRandomTweet(hashtag: string, cb: (tweet: string) => void): void {
        const params = {
            q: hashtag,
            result_type: "recent",
            lang: "en",
            count: "20",
            include_entities: "true",
            tweet_mode: "extended",
        };
        this.getTweets(params, (data) => {
            // Pick one out of all tweets received to display by random
            cb(data.statuses[Math.floor(Math.random() * parseInt(params.count, 10))].retweeted_status.full_text);
        });
    }

    /**
     * Query tweets from twitter.
     * @param params object specifying search paramaters
     * @param cb calback
     */
    public getTweets(params: object, cb: (data: ResponseData) => void): void {
        this.instance.get("search/tweets", params, (error, data, response) => {
            cb(data);
        });
    }
}
