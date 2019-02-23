import * as Dotenv from "dotenv";
import Discord from "discord.js";

import DBCore from "./DBCore";
import TwitterCore from "./TwitterCore";
import CommandManager from "../managers/CommandManager";

/**
 * @classdesc The main routine based around the Discord.Client Object.
 */
export default class Core {

    /**
     * discord.js client implementation.
     */
    private bot: Discord.Client;

    /**
     * Database manager.
     */
    private databaseCore: DBCore;

    /**
     * Twitter client implementation.
     */
    private twitterCore: TwitterCore;

    /**
     * CommandManager instance.
     */
    private commandManager: CommandManager;

    /**
     * @classdesc Core of NPC bot.
     */
    public constructor() {
        Dotenv.config();
        this.bot = new Discord.Client();
        this.databaseCore = new DBCore();
        this.twitterCore = new TwitterCore();
        this.commandManager = new CommandManager(this);
    }

    /**
     * Start the main processes of the bot.
     */
    public async start(): Promise<void> {
        this.bot.login(process.env.DISCORD_TOKEN)
        .catch((err) => {
            console.error(`Unable to login to discord, check tokens and .env variables. ${err}`);
        });
        this.bot.on("ready", async () => {
            this.bot.user.setActivity("potshot alex lol", {type: "PLAYING"});
            console.log(`${this.bot.user.username} is online!`);
        });
        this.bot.on("message", (message: Discord.Message) => {
            // Check message isn't empty
            // Ignore all bot messages and messages from self
            if (!message.author.bot) {
                this.commandManager.parseCommand(this, message.content, message.author.id, message);
            }
        });
    }

    /**
     * Get bot instance.
     * @returns bot Discord.Client
     */
    public getBot(): Discord.Client {
        return this.bot;
    }

    /**
     * Returns DBCore for database usage.
     * @returns DBCore
     */
    public getDBCore(): DBCore {
        return this.databaseCore;
    }

    /**
     * Returns Twitter instance.
     * @returns twitterManager
     */
    public getTwitterManager(): TwitterCore {
        return this.twitterCore;
    }

    /**
     * Returns CommandManager.
     * @returns CommandManager
     */
    public getCommandManager(): CommandManager {
        return this.commandManager;
    }
}

export const app: Core = new Core();
