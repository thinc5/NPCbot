import TwitterClient, { ResponseData } from "twitter";
import { TweetData } from "./ITweetData";


/**om "../NPCbot";
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
    public async getTweets(params: object): Promise<TwitterClient.ResponseData> {
        return new Promise<TwitterClient.ResponseData>((resolve, reject) => {
            this.instance.get("search/tweets", params, (error, data, response) => {
                if (response.statusCode !== 200) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }

    /**
     * Given a tweet from a TwitterClient.ResponseData.statuses object,
     * parse the tweet text and other important values and return in a json object.
     * @param TwitterClient.ResponseData.statuses tweet to parse.
     * @returns json
     */
    public parseTweet(rawTweet: any): TweetData {
        let tweet: TweetData = {
            url: `https://twitter.com/user/status/${rawTweet.id_str}`,
            text: rawTweet.full_text,
        };
        try {
            if (rawTweet.entities.media[0].media_url_https !== undefined) {
                tweet.media = rawTweet.entities.media[0].media_url_https;
            }
        } catch (err) {
            // ignore
        }
        return tweet;
    }

    /**
     * Get a random tweet from twitter with provided hashtag.
     * @param object params
     * @param cb callback that returns the tweet in string form
     */
    public async getRandomTweet(query: string): Promise<TweetData> {
        // Parameters for query
        const params = {
            q: query,
            result_type: "mixed",
            lang: "en",
            count: "50",
            include_entities: "true",
            tweet_mode: "extended",
        };
        return new Promise<TweetData> ((resolve, reject) => {
            this.getTweets(params)
            .then((data) => {
                const randomIndex = Math.floor(Math.random() * (data.search_metadata.count - 1));
                const rawTweet = data.statuses[randomIndex];
                resolve(this.parseTweet(rawTweet));
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    /**
     * Get tweets from twitter given a provided hashtag.
     * @returns array of tweets and the query used to find them.
     */
    public async getMaterialByTweet(queries: string[]): Promise<TweetData[]> {
        const parmams = {
            q: "",
            result_type: "mixed",
            lang: "en",
            count: "250",
            include_entities: "true",
            tweet_mode: "extended",
        };
        return new Promise<TweetData[]>((resolve, reject) => {
            const rawdata: any[] = [];
            queries.forEach((tag) => {
                parmams.q = tag;
                this.getTweets(parmams)
                .then((data) => {
                    rawdata.push(data.statuses);
                    console.log(data);
                })
                .catch((err) => {
                    reject(err);
                });
            });
            console.log(queries);
            console.log(rawdata);
            const tweets: string[][] = [[]];
            rawdata.forEach((data: any) => {
                const query = data.search_metadata.query;
                rawdata.forEach((rawtweet: any) => {
                    tweets.push([rawtweet.id_str, rawtweet.full_text, query]);
                });
            });
            resolve([]);
        });
    }

    /**
     * Get top queries by WOEID found http://woeid.rosselliot.co.nz/
     * @param woeid
     * @returns TwitterClient.ResponseData
     */
    public async getTrendingTags(woeid: string): Promise<TwitterClient.ResponseData> {
        const params = {
            id: parseInt(woeid, 10),
        };
        return new Promise<TwitterClient.ResponseData>((resolve, reject) => {
            this.instance.get("trends/place", params, (error, data, response) => {
                if (response.statusCode !== 200) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }
}
