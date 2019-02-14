// .env configuration
import * as Dotenv from "dotenv";

// Dependencies
import * as Discord from "discord.js";
import TwitterInstance from "../managers/TwitterManager";

export default class Core {

    /**
     * discord.js client implementation.
     */
    private bot: Discord.Client;

    /**
     * Twitter client implementation.
     */
    private twitterInstance!: TwitterInstance;

    /**
     * @classdesc Starts bot.
     */
    public constructor() {
        // Load configuration
        Dotenv.config();
        console.log(".env configuration loaded.");
        // Start up discord bot
        this.bot = new Discord.Client();
    }

    /**
     * Start the main processes of the bot.
     */
    public async start(): Promise<number> {
        // Log the bot in
        this.bot.login(process.env.DISCORD_TOKEN);
        this.bot.on("ready", async () => {
            console.log(`${this.bot.user.username} is online!`);
            // Start up twitter api client
            await this.initializeModules();
            console.log("Connected to twitter api.");
            this.bot.user.setActivity(process.env.ACTIVITY as string);
            console.log("Loading commands...");
        });
        // console.log("Bot shutting down...");
        // this.bot.destroy();
        return 0;
    }

    /**
     * Initilize all NPCbot's modules.
     */
    public async initializeModules(): Promise<void> {
        try {
            this.twitterInstance = new TwitterInstance();
        } catch (err) {
            console.log(err.message);
        }
    }
}

export const app: Core = new Core();
