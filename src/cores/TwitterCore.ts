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
        this.instance.get("trends/place", params, (error, data, response) => {
            if (response.statusCode !== 200) {
                console.log(error);
            }
            cb(data);
        });
    }

    /**
     * Los Angeles (2442047)
     * @param hashtag
     * @param cb
     */
    public getLaHashtags(cb: (hashtags: string) => void): void {
        const params = {
            id: 2442047,
        };
        this.getTrendingHashtags(params, (response) => {
            const trends: any[] = response[0].trends;
            let hashtags = "|Tag|Tweets|\n|---|---|\n";
            trends.forEach((trend) => {
                hashtags = hashtags.concat(`|${trend.name}|${trend.tweet_volume}|\n`);
            });
            cb(`${hashtags}`);
        });
    }

    /**
     * Get a random tweet from twitter with provided hashtag.
     * @param object params
     * @param cb callback that returns the tweet in string form
     */
    public getRandomTweet(hashtag: string, cb: (tweet: string, url: string, mediaUrl: string) => void): void {
        // Parameters for query
        const params = {
            q: hashtag,
            result_type: "mixed",
            lang: "en",
            count: "50",
            include_entities: "true",
            tweet_mode: "extended",
        };
        this.getTweets(params, (data: TwitterClient.ResponseData) => {
            // Pick one out of all tweets received to display by random
            const totalTweets: string[] = [];
            data.statuses.forEach((e: string) => {
                totalTweets.push(e);
            });
            const randomIndex = Math.floor(Math.random() * (totalTweets.length - 1));
            if (data.statuses[randomIndex] === undefined) {
                cb(`Unable to find tweet.`, "", "");
            } else {
                const tweet: string = data.statuses[randomIndex].full_text;
                let mediaUrl: string;
                try {
                    mediaUrl = data.statuses[randomIndex].entities.media[0].media_url_https;
                } catch (err) {
                    mediaUrl = "";
                }
                cb(`${tweet}`, `https://twitter.com/user/status/${data.statuses[randomIndex].id_str}`, mediaUrl);
            }
        });
    }

}
