/**
 * The fields of tweet data we care about.
 */
export interface TweetData {
    id: string;
    url: string;
    text: string;
    media?: string;
    query: string;
}
