// Configuration
import config from "../botconfig.json";

// Dependencies
import * as Discord from "discord.js";

export default class Core {

    private bot: Discord.Client;

    /**
     * @classdesc Starts bot.
     */
    public constructor() {
        console.log("Bot Started.");
        this.bot = new Discord.Client({disableEveryone: true});
    }

    /**
     * Start the main processes of the bot.
     */
    public async start(): Promise<number> {
        this.bot.login(config.token);
        this.bot.on("ready", async () => {
            console.log(`${this.bot.user.username} is online!`);
            this.bot.user.setActivity(config.game);
        });
        return 0;
    }
}

export const app: Core = new Core();

// TODO: Seperate all discord stuff to a seperate file so bot can function
// on any platform Also ask tony about constructing sentences from data
