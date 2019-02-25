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
     * Get tweets from twitter given a provided hashtag.
     */
    public async getMaterialByTweet(hashtags: string[], cb: (tweets: string[][]) => void): Promise<void> {
        const parmams = {
            q: "",
            result_type: "mixed",
            lang: "en",
            count: "250",
            include_entities: "true",
            tweet_mode: "extended",
        };
        // Get responses for each hashtag
        const rawdata: any[] = [];
        await hashtags.forEach((tag) => {
            parmams.q = tag;
            this.getTweets(parmams, (data) => {
                rawdata.push(data.statuses);
                console.log(data);
            });
        });
        console.log(hashtags);
        console.log(rawdata);
        const tweets: string[][] = [[]];
        rawdata.forEach((data: any) => {
            const query = data.search_metadata.query;
            rawdata.forEach((rawtweet: any) => {
                tweets.push([rawtweet.id_str, rawtweet.full_text, query]);
            });
        });
        cb(tweets);
    }

    /**
     * Get top hashtags by WOEID found http://woeid.rosselliot.co.nz/
     * @param hashtag
     * @param cb
     */
    public getTrendingHashtags(woeid: string, cb: (hashtags: string[]) => void): void {
        const params = {
            id: parseInt(woeid, 10),
        };
        this.instance.get("trends/place", params, (error, data, response) => {
            if (response.statusCode !== 200 || error) {
                console.log(error);
                cb(["Unable to find trending data for provided location."]);
                return;
            }
            console.log(data);
            const trends: any[] = data[0].trends;
            let hashtags: string[] = ["Tag    :  Number of Tweets"];
            trends.forEach((trend) => {
                hashtags.push(`${trend.name}   |   ${trend.tweet_volume}|`);
            });
            // Limit the number of results to 10
            // TODO: figure out why some dont have a tweet_volume
            hashtags = hashtags.slice(0, 10);
            cb(hashtags);
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
