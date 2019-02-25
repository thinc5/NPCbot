import Dotenv from "dotenv";
import DBCore from "./src/cores/DBCore";

Dotenv.config();

/**
 * Update the bot's status.
 */
function progressUpdate(): void {
    console.log(`Thinking: 10%`);
    setTimeout(console.log, 3000, `% register to sign up for knowledge`);
}

setInterval(progressUpdate, 6000);