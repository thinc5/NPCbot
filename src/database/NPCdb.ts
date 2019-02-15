import * as MySql from "mysql";

/**
 * @classdesc Wrapper class around MySql Database Connection object.
 */
export default class NPCdb {

    private connection: MySql.Connection;

    public constructor(){
        this.connection = MySql.createConnection({
            host: "",
            user: "",
            password: "",
            database: "",
        });
    }
    
}
