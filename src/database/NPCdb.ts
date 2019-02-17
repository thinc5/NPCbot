import * as SqLite from "sqlite";

/**
 * @classdesc Wrapper class around MySql Database Connection object.
 */
export default class NPCdb {

    private connection!: SqLite.Database;

    public constructor() {
        this.loadDb();
        this.readDb();
    }

    private async loadDb(): Promise<void> {
        const dbPromise = SqLite.open("./test.db", {
            //      Open r+w    If does not exist create
            mode: 0x00000002 | 0x00000004,
        });
        dbPromise.then((db) => {
            this.connection = db;
            this.connection.migrate({
                force: "last",
                migrationsPath: "src/database/migrations",
            }).catch((error) => {
                console.error(`Unable to run migrations: ${error}`);
            });
        }).catch((error) => {
            console.error(`Unable to open database: ${error}`);
        });
    }

    public async readDb(): Promise<void> {
        this.connection.all(`SELECT * FROM RegisteredChannels`).then((rows) => {
            console.log(rows);
        }).catch((error) => {
            console.error(error);
        });
    }
}
