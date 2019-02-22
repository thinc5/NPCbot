import Dotenv from "dotenv";
import DBCore from "./src/cores/DBCore";

Dotenv.config();

const databaseCore: DBCore = new DBCore();

// databaseCore.getRegisteredChannels().then((result) => {
//     console.log(result);
// })
// .catch((err) => {
//     console.error(err);
// });