import * as Sqlite from "sqlite";

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
            //DEBUG FUNCTION: this.readDB();
            this.updateRegisteredChannels()
            .then(() => {
                console.log(this.registeredChannels);
                this.registerChannel("23123");
                console.log(this.registeredChannels);
                this.registerChannel("23522625");
                console.log(this.registeredChannels);
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
                this.connection.exec(
                    `CREATE TABLE IF NOT EXISTS RegisteredChannels (channel_id INTEGER PRIMARY KEY);`)
                .catch((err) => {
                    console.error(err);
                });
                // this.connection.migrate({
                //     force: "last",
                //     migrationsPath: "./src/database/migrations",
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
                rows.forEach(id => {
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
    public registerChannel(channel_id: string): void {
        // If this already exists ignore request.
        let targetIndex: number;
        if ((targetIndex = this.registeredChannels.indexOf(channel_id)) !== -1) {
            return;
        }
        this.registeredChannels.push(channel_id);
        const id = parseInt(channel_id, 10);
        this.connection.run(`INSERT INTO RegisteredChannels(channel_id)`
        + ` SELECT ${id} WHERE NOT EXISTS(SELECT 1 FROM RegisteredChannels`
        + ` WHERE channel_id = ${id});`);
    }

    /**
     * Unregister channel to NPCbot's db if channel exists.
     * @param channel_id
     */
    public unregisterChannel(channel_id: string): void {
        // If this does not exist ignore.
        let targetIndex: number;
        if ((targetIndex = this.registeredChannels.indexOf(channel_id)) !== -1) {
            return;
        }
        this.registeredChannels.splice(targetIndex, 1);
        const id = parseInt(channel_id, 10);
        this.connection.run(`DELETE FROM RegisteredChannels WHERE channel_id = ${id}`
        + ` AND EXISTS(SELECT 1 FROM RegisteredChannels WHERE channel_id = ${id})`);
        return;
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
