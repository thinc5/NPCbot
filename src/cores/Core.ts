import * as Dotenv from "dotenv";
import Discord from "discord.js";

import DBCore from "./DBCore";
import TwitterCore from "./TwitterCore";
import CommandManager from "../managers/CommandManager";
import ThoughtCore from "./ThoughtCore";

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
     * ThoughtCore instance.
     */
    private thoughtCore: ThoughtCore;

    /**
     * @classdesc Core of NPC bot.
     */
    public constructor() {
        Dotenv.config();
        this.bot = new Discord.Client();
        this.databaseCore = new DBCore();
        this.twitterCore = new TwitterCore();
        this.commandManager = new CommandManager(this);
        this.thoughtCore = new ThoughtCore(this);
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
            console.log(`${this.bot.user.username} is online!`);
            this.thoughtCore.start();
            this.getTwitterManager().getMaterialByTweet(["dog", "cat"], (tweets) => {
                this.getDBCore().storeTweets(tweets);
            })
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

    /**
     * Update the bot's status given a provided activity description.
     * @param activity string to set activity to.
     */
    public updateActivity(activity: string): void {
        this.bot.user.setActivity(activity, {type: 3});
    }

    /**
     * Update the bot's avatar provided a filepath.
     */
    public updateAvatar(filepath: string): void {
        this.bot.user.setAvatar(filepath)
        .catch((err) => {
            console.error(err);
        });
    }
}

export const app: Core = new Core();
