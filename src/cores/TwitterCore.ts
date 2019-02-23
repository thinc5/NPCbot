import TwitterClient, { ResponseData } from "twitter";

/**
 * @classdesc A wrapper class around TwitterClient providing custom functionality.
 */
export default class TwitterCore {

    private instance: TwitterClient;

    public constructor() {
        this.instance =  new TwitterClient({
            consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
            bearer_token: process.env.TWITTER_BEARER_TOKEN as string,
          });
    }

    /**
     * Query tweets from twitter.
     * @param params object specifying search parameters
     * @param cb callback
     */
    public getTweets(params: object, cb: (data: ResponseData) => void): void {
        this.instance.get("search/tweets", params, (error, data, response) => {
            if (error) {
                console.log(error);
            } else {
                cb(data);
            }
        });
    }

    /**
     * Get trending hashtags in provided WOID location.
     */
    public getTrendingHashtags(params: object, cb: (data: ResponseData) => void): void {
        this.instance.get("trends", params, (error, data, response) => {
            console.log(error + " " + data + " " + response);
        });

    }

    /**
     * Los Angeles (2442047)
     * @param hashtag
     * @param cb
     */
    public getLaHashtags(): void {
        const params = {
            id: 2442047,
        };

        this.getTrendingHashtags(params, (response) => {
            console.log(response);
        });
    }

    /**
     * Get a random tweet from twitter with provided hashtag.
     * @param object params,
     */
    public getRandomTweet(hashtag: string, cb: (tweet: string) => void): void {
        // Parameters for query
        const params = {
            q: hashtag,
            result_type: "mixed",
            lang: "en",
            count: "1",
            include_entities: "true",
            tweet_mode: "extended",
        };
        this.getTweets(params, (data) => {
            // Pick one out of all tweets received to display by random
            // const randomIndex = Math.floor(Math.random() * (parseInt(params.count, 10) - 1));
            // console.log(randomIndex);
            if (data.statuses[0] === undefined) {
                cb(`Unable to find tweet.`);
            } else {
                const tweet: string = data.statuses[0].full_text;
                cb(`${tweet}`);
            }
        });
    }

}
