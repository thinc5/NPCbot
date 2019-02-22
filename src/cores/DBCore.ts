import * as Sqlite from "sqlite";

/**
 * @classdesc Wrapper class around MySql Database Connection object.
 */
export default class DBCore {

    /**
     * Database connection.
     */
    private connection!: Sqlite.Database;

    public constructor() {
        this.loadDb().then(() => {
            console.log("Database Manager connected.");
            this.readDB();
            this.getRegisteredChannels()
            .then((results) => {
                console.log(`row: ${results}`);
            })
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
            const dbPromise = Sqlite.open("NPCdb.sqlite", {   //process.env.DB_LOCATION as string
                //     Open r+w    If does not exist create
                mode: 0x00000002 | 0x00000004,
            });
            // Resolve promise
            dbPromise.then((db) => {
                this.connection = db;
                this.connection.migrate({
                    force: "last",
                    migrationsPath: "./src/database/migrations",
                })
                .catch((error) => {
                    console.error(`Unable to run migrations: ${error}`);
                });
                resolve();
            })
            .catch((error) => {
                console.error(`Unable to open database: ${error}`);
                reject(error);
            });
        })
    }

    /**
     * Debug function to show all .
     * @param query SQL query to be "executed".
     */
    public async readDB(): Promise<void> {
        if (this.connection == undefined) {
            console.error("Database connection closed.");
        }
        this.connection.get(`SELECT * FROM RegisteredChannels`)
        .then((rows) => {
            console.log(rows);
        })
        .catch((error) => {
            console.error(`Unable to read from database, check it exists. ${error}`);
        });
    }

    /**
     * Retrieves list of registered channel ids.
     * @returns channel_ids
     */
    public async getRegisteredChannels(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.connection == undefined) {
                reject("Database connection closed.");
            }
            this.connection.get(`SELECT channel_id FROM RegisteredChannels`)
            .then((rows) => {
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
    public async registerChannel(channel_id: string): Promise<void> {
        const id = parseInt(channel_id, 10);
        this.connection.run(`INSERT INTO RegisteredChannels(channel_id)`
        + ` SELECT ${id} WHERE NOT EXISTS(SELECT 1 FROM RegisteredChannels`
        + ` WHERE channel_id = ${id});`);
    }

    /**
     * Unregister channel to NPCbot's db if channel exists.
     * @param channel_id
     */
    public async unregisterChannel(channel_id: string): Promise<void> {
        const id = parseInt(channel_id, 10);
        this.connection.run(`DELETE FROM RegisteredChannels WHERE channel_id = ${id}`
        + ` AND EXISTS(SELECT 1 FROM RegisteredChannels WHERE channel_id = ${id})`);
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

}
