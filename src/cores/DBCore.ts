import { Sequelize } from "sequelize";

import { TweetData } from "../../types/TweetData";

import { defineRegisteredChannels } from "../models/RegisteredChannels";
import { defineTrends } from "../models/Trends";

/**
 * @classdesc Wrapper class around Sequelize.
 */
export default class DBCore {

    /**
     * Database connection.
     */
    private connection: Sequelize;

    public constructor() {
        // Connect to the database.
        this.connection = new Sequelize(process.env.DB_NAME as string,
            process.env.DB_USER as string,
            process.env.DB_PASSWORD as string,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT as any,
                logging: false
            }
        );
        // Define models.
        defineRegisteredChannels(this.connection);
        defineTrends(this.connection);
        // Force model sync.
        this.connection.sync({ force: false });
        console.log("Database Manager connected.");
    }

    public getConnection(): Sequelize {
        return this.connection;
    }

    /**
     * Returns array of registered channels.
     */
    public async getRegisteredChannels(): Promise<string[]> {
        const raw = await this.connection.models.RegisteredChannels.findAll();
        const clean = raw.map((row: any) => {
            if (row.dataValues.channel_id) {
                return row.dataValues.channel_id;
            }
        })
        return clean;
    }

    /**
     * Register channel in db.
     * @param channel_id
     */
    public async registerChannel(channel_id: string): Promise<void> {
        // If this already exists ignore request.
        let exists: any;
        try {
                exists = await this.connection.models.RegisteredChannels.findOne({ where: { channel_id }, paranoid: false });
                if (exists && exists.dataValues && exists.dataValues.deletedAt) {
                    // Restore instead of create.
                    await exists.restore();
                    return;
                }
        } catch (err) {
            console.error(err)
            throw new Error("Internal Database Error.");
        }
        if (exists) {
            throw new Error("Channel already registered.");
        }
        try {
            await this.connection.models.RegisteredChannels.create({ channel_id });
        } catch (err) {
            console.error(err);
            throw new Error("Internal Database Error.");
	    }
    }

    /**
     * Unregister channel from db if channel exists.
     * @param channel_id
     */
    public async unregisterChannel(channel_id: string): Promise<void> {
        let exists;
        try {
            exists = await this.connection.models.RegisteredChannels.findOne({ where: { channel_id } });
        } catch (err) {
            throw new Error("Internal Database Error.");
        }
        if (!exists) {
            throw new Error("Channel is not registered.");
        }
        try {
            await this.connection.models.RegisteredChannels.destroy({ where: { channel_id } });
        } catch (err) {
            console.error(err);
            throw new Error("Internal Database Error.");
	    }
    }

    /**
     * Given a two dimensional array of strings with tweet_id, query and text,
     * load data into database.
     */
    public async storeTweets(data: TweetData[]): Promise<void> {
        for (let i = 0; i < data.length; i++) {
            try {
                // Is this tweet already stored?
                const exists = await this.connection.models.Trends.count({
                    where: {
                        tweet_id: data[i].id
                    }
                });
                if (exists) {
                    continue;
                }
                // Store this tweet.
                await this.connection.models.Trends.findOrCreate({
                    where: {
                        tweet_id: data[i].id,
                        hashtag: data[i].query,
                        body: data[i].text.substr(0, 200)
                    }
                });
            } catch (err) {
                console.error("Tweet already exists", err);
            }
        }
    }

    /**
     * Fetch the body of all stored tweets.
     */
    public async retrieveTweets(): Promise<string[]> {
        let raw: any;
        try {
            raw = await this.connection.models.Trends.findAll({
                attributes: ["body"]
            });
        } catch (err) {
            console.error(err);
        }
        const clean = raw.map((row: any) => {
            return row.dataValues.body;
        });
        return clean;
    }

    /**
     * Forget all stored tweets.
     */
    public async forgetTweets(): Promise<void> {
        try {
            await this.connection.models.Trends.destroy({
                where: {},
                truncate: true
            });
        } catch (err) {
            console.error(err);
        }
    }

}
