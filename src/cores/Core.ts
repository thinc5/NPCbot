// .env configuration
import * as Dotenv from "dotenv";

// Dependencies
import * as Discord from "discord.js";
import TwitterInstance from "./TwitterCore";
import CommandManager from "../managers/CommandManager";
import NPCdb from "../database/NPCdb";

/**
 * @classdesc The main routine based around the Discord.Client Object.
 */
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
     * CommandManager instance.
     */
    private commandManager!: CommandManager;

    /**
     * Database manager.
     */
    private databaseManager: NPCdb;

    /**
     * @classdesc Starts bot.
     */
    public constructor() {
        // Load configuration
        Dotenv.config();
        console.log(".env configuration loaded.");
        // Start up discord bot
        this.bot = new Discord.Client();
        this.databaseManager = new NPCdb();
    }

    /**
     * Start the main processes of the bot.
     */
    public async start(): Promise<void> {
        // Log the bot in
        this.bot.login(process.env.DISCORD_TOKEN)
        .catch((error) => {
            if (error) {
                console.log("unable to login to discord, check tokens and .env variables.");
            }
        });
        // Bot's routine
        this.bot.on("ready", async () => {
            console.log(`${this.bot.user.username} is online!`);
            await this.initialize();
            this.bot.user.setActivity(process.env.ACTIVITY as string);
        });
        this.bot.on("message", (message: Discord.Message) => {
            // Check message isn't empty
            if (message.content) {
                this.commandManager.parseCommand(this, message.content, message.author.id, message);
            }
        });
    }

    /**
     * Initialize all NPCbot's managers.
     */
    public async initialize(): Promise<void> {
        try {
            this.twitterInstance = new TwitterInstance();
            console.log("Connected to twitter api.");
            this.commandManager = new CommandManager(this);
        } catch (err) {
            console.log(err.message);
        }
    }

    /**
     * Get bot instance.
     * @returns bot Discord.Client
     */
    public getBot(): Discord.Client {
        return this.bot;
    }

    /**
     * Returns Twitter instance.
     * @returns TwitterInstance
     */
    public getTwitterInstance(): TwitterInstance {
        return this.twitterInstance;
    }

    /**
     * Returns this core's instance of CommandManager.
     * @returns CommandManager
     */
    public getCommandManager(): CommandManager {
        return this.commandManager;
    }

}

export const app: Core = new Core();
