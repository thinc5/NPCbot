import TwitterClient, { ResponseData } from "twitter";

export default class TwitterInstance {

    private instance: TwitterClient;

    public constructor() {
        this.instance =  new TwitterClient({
            consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
            bearer_token: process.env.TWITTER_BEARER_TOKEN as string,
          });
    }

    /**
     * grabRandomTweet
     */
    public getRandomTweet(cb: (tweet: string) => void): void {
        const params = {
            q: "#nodejs, #Nodejs",
            result_type: "recent",
            lang: "en",
            count: "20",
            include_entites: "true",
            tweet_mode: "extended",
        };
        this.getTweets(params, (data) => {
            // let i = 0;
            // while (i < parseInt(params.count, 10)) {
            //     if (data.statuses[i].text !== undefined) {
            //         console.log(data.statuses[i].text);
            //     }
            //     i++;
            // }
            cb(data.statuses[Math.floor(Math.random() * parseInt(params.count, 10))].retweeted_status.full_text);
        });
    }

    public getTweets(params: object, cb: (datas: ResponseData) => void): void {
        this.instance.get("search/tweets", params, (error, data, response) => {
            cb(data);
        });
    }
}
