import * as Sqlite from "sqlite";

/**
 * @classdesc Wrapper class around MySql Database Connection object.
 */
export default class NPCdb {

    /**
     * Database connection.
     */
    private connection!: Sqlite.Database;

    public constructor() {
        this.loadDb().then(() => {
            //this.readDB();
            console.log("Database online!");
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
     * Run a query on database.
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
     * Get array of strings indicating channels which NPCbot is registered in.
     */
    public async registeredChannels(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.queryDB(`SELECT * FROM RegisteredChannels WHERE bot_enabled  = "TRUE"`);
            resolve();
        });
    }

}
