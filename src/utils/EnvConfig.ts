import * as Dotenv from "dotenv";

try {
    Dotenv.config();
} catch (err) {
    console.error(err);
    throw new Error(err);
}
