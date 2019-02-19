import {  } from "discord.js"
import Filesystem from "fs"

import Core from "../cores/Core";
import AbstractManager from "./AbstractManager";
import Discord from "discord.js";

import CommandRegistry from "../registries/CommandRegistry";
import AbstractCommand from "../commands/AbstractCommand";

/**
 * @classdesc Manages registration and fulfillment of commands.
 */
export default class CommandManager extends AbstractManager {

    private commandRegistry: CommandRegistry;

    public constructor(core: Core) {
        super(core, "./src/commands/enabled");
        this.commandRegistry = new CommandRegistry();
        this.generateImports().then(() => {
            this.loadCommands();
        }).catch((error) => {
            console.error(error);
        });
    }

    /**
     * Load commands.
     */
    public async loadCommands(): Promise<void> {
        for (const path of this.importPaths) {
            const commandClass = await import(`../commands/enabled/${path}`);
            if (!commandClass.default) {
                console.log(`Failed to register command. ${path} has no default export.`);
            } else if (!(new commandClass.default() instanceof AbstractCommand)) {
                console.log(`Failed to register command. ${path} exported class is not of type "AbstractCommand".`);
            } else if (!this.commandRegistry.registerCommand(new commandClass.default())) {
                console.log(`Failed to register command as it has already been registered.`)
            }
        }
        console.log(`Successfully imported ${this.commandRegistry.getRegistrySize()} out of ` +
            `${this.importPaths.length} ${this.importPaths.length === 1 ? "command" : "commands"}.`);
    }

    /**
     * Update command list.
     */
    public update(): void {
        super.update();
        this.loadCommands();
    }

    /**
     * Filter chat messages for commands and take appropriate actions.
     */
    public parseCommand(core: Core, raw: string, userId: string, message: Discord.Message): void {
        // TODO: Link to .env
        const commandPrefix = process.env.COMMAND_PREFIX;
        let substrings: string[] = raw.split(" ");
        // Does the line start with the defined prefix?
        if (substrings[0] !== commandPrefix) {
            console.log("wrong prefix "+raw);
            return;
        }
        // Check if valid command
        if (!this.commandRegistry.hasKey(substrings[1])) {
            // Send usage information to user
            message.reply("usage"); ///this.commandRegistry.getValue(substrings[1]).getUsage());
            return;
        }
        // Try and run command
        try {
            const command: AbstractCommand | undefined  = this.commandRegistry.getValue(substrings[1]);
            if (command === undefined) {
                console.log("Command undefined...");
            } else {
                command.called(core, message.channel.id, substrings.slice(1));
            }
        } catch (err) {
            console.error(err);
        }
        return;
    }

}
