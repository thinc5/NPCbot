import * as Sqlite from "sqlite";

/**
 * @classdesc Wrapper class around MySql Database Connection object.
 */
export default class NPCdb {

    private connection!: Sqlite.Database;

    public constructor() {
        this.loadDb().then(() => {
            this.readDb();
        });
    }

    private async loadDb(): Promise<void> {
        return new Promise((resolve, reject) => {
            const dbPromise = Sqlite.open("./test.sqlite", {
                //      Open r+w    If does not exist create
                mode: 0x00000002 | 0x00000004,
            });
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

    public async readDb(): Promise<void> {
        if (this.connection == undefined) {
            console.log("wtf");
        }
        this.connection.get(`SELECT * FROM RegisteredChannels`)
        .then((rows) => {
            console.log(rows);
        })
        .catch((error) => {
            console.error(`Unable to read from database, check it exists. ${error}`);
        });
    }
}
