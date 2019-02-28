import * as Sqlite from "sqlite";

import { ITweetData } from "./ITweetData";
import { throws } from "assert";

/**
 * @classdesc Wrapper class around MySql Database Connection object.
 */
export default class DBCore {

    /**
     * Database connection.
     */
    private connection!: Sqlite.Database;

    /**
     * Cache of registered Channels.
     */
    private registeredChannels: string[];

    public constructor() {
        this.registeredChannels = [];
        this.loadDb().then(() => {
            console.log("Database Manager connected.");
            // DEBUG FUNCTION: this.readDB();
            this.updateRegisteredChannels()
            .catch((err) => {
                console.error(err);
            });
        }).catch((err) => {
            console.error(`Unable to load database: ${err}`);
        });
    }

    /**
     * Load database from file or create if it does not exist or cannot be found.
     */
    private async loadDb(): Promise<void> {
        return new Promise((resolve, reject) => {
            const dbPromise = Sqlite.open(process.env.DB_LOCATION as string, {
                //     Open r+w    If does not exist create
                mode: 0x00000002 | 0x00000004,
            });
            // Resolve promise
            dbPromise.then((db) => {
                this.connection = db;
                this.connection.exec(
                    `CREATE TABLE IF NOT EXISTS RegisteredChannels (channel_id TEXT PRIMARY KEY);`)
                .catch((err) => {
                    console.error(err);
                });
                this.connection.exec(
                    `CREATE TABLE IF NOT EXISTS Trends (tweet_id TEXT PRIMARY KEY, hashtag TEXT NOT NULL, text TEXT NOT NULL);`)
                .catch((err) => {
                    console.error(err);
                });
                // this.connection.migrate({
                //     force: "last",
                //     migrationsPath: "./src/migrations",
                // })
                // .catch((error) => {
                //     console.error(`Unable to run migrations: ${error}`);
                // });
                resolve();
            })
            .catch((error) => {
                console.error(`Unable to open database: ${error}`);
                reject(error);
            });
        });
    }

    /**
     * Debug function to show all registered channels.
     * @param query SQL query to be "executed".
     */
    public async readDB(): Promise<void> {
        if (this.connection == undefined) {
            console.error("Database connection closed.");
        }
        this.connection.all(`SELECT * FROM RegisteredChannels`)
        .then((rows) => {
            console.log(rows);
        })
        .catch((error) => {
            console.error(`Unable to read from database, check it exists. ${error}`);
        });
    }

    /**
     * Returns array of registered channels.
     */
    public getRegisteredChannels(): string[] {
        return this.registeredChannels;
    }

    /**
     * Retrieves list of registered channel ids.
     */
    public async updateRegisteredChannels(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if (this.connection == undefined) {
                reject("Database connection closed.");
            }
            this.connection.all(`SELECT channel_id FROM RegisteredChannels`)
            .then((rows) => {
                this.registeredChannels = [];
                rows.forEach((id) => {
                    this.registeredChannels.push(id.channel_id);
                });
                resolve(rows);
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * Register channel to NPCbot's db.
     * @param channel_id
     */
    public async registerChannel(channelID: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            // If this already exists ignore request.
            const targetIndex: number = this.registeredChannels.indexOf(channelID);
            if (targetIndex !== -1) {
                reject(new Error("already registered"));
            }
            this.registeredChannels.push(channelID);
            this.connection.run(`INSERT INTO RegisteredChannels(channel_id)`
            + ` SELECT ${channelID} WHERE NOT EXISTS(SELECT 1 FROM RegisteredChannels`
            + ` WHERE channel_id = ${channelID});`);
            resolve();
        });
    }

    /**
     * Unregister channel to NPCbot's db if channel exists.
     * @param channel_id
     */
    public async unregisterChannel(channelID: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            // If this channel does not exist ignore.
            const targetIndex: number = this.registeredChannels.indexOf(channelID);
            if (targetIndex === -1) {
                reject(new Error("not already registered"));
            }
            this.registeredChannels.splice(targetIndex, 1);
            this.connection.run(`DELETE FROM RegisteredChannels WHERE channel_id = ${channelID}`
            + ` AND EXISTS(SELECT 1 FROM RegisteredChannels WHERE channel_id = ${channelID})`);
            resolve("Gucci Mane");
        });
    }

    /**
     * Run a query on database.
     * @param query SQL query to be "executed".
     */
    public async queryDB(query: string): Promise<void> {
        if (this.connection == undefined) {
            console.error("Database connection closed.");
        }
        this.connection.get(query)
        .then((rows) => {
            console.log(rows);
        })
        .catch((error) => {
            console.error(`Unable to read from database, check it exists. ${error}`);
        });
    }

    /**
     * Given a two dimensional array of strings with tweet_id, query and text,
     * import data into database.
     */
    public storeTweets(data: ITweetData[]): void {
        const statement = this.connection.prepare("INSERT INTO Trends (tweet_id, hashtag, text) VALUES(?, ?, ?);");
        data.forEach((tweet) => {
            statement.then((s) => {
                s.run(tweet.id, tweet.query, tweet.text)
                .catch((err) => {
                    // Do nothing
                })
            })
            .catch((err) => {
                // Do nothing
            });
        });
        console.log("Finished material gathering job.");
    }

}
