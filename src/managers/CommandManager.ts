import * as Discord from "discord.js"

import Core from "../cores/Core";
import AbstractManager from "./AbstractManager";
import CommandRegistry from "../registries/CommandRegistry";
import AbstractCommand from "../commands/AbstractCommand";

/**
 * @classdesc Manages registration and fulfillment of commands.
 */
export default class CommandManager extends AbstractManager {

    private commandRegistry: CommandRegistry;

    public constructor(core: Core) {
        super(core, "src/commands/");
        this.commandRegistry = new CommandRegistry();
        this.loadCommands();
    }

    /**
     * Load commands.
     */
    public async loadCommands(): Promise<void> {
        for (const path of this.importPaths) {
            const commandClass = await import(path);
            if (!commandClass.default) {
                console.log(`Failed to register command. ${path} has no default export.`);
            } else if (!(new commandClass.default() instanceof AbstractCommand)) {
                console.log(`Failed to register command. ${path} exported class is not of type "AbstractCommand".`);
            } else if (!this.commandRegistry.registerCommand(new commandClass.default())) {
                console.log(`Failed to register command as it has already been registered.`)
            }
        }
        console.log(`Successfully imported ${this.commandRegistry.getRegistrySize()} out of ${this.importPaths.length} ${this.importPaths.length === 1 ? "command" : "commands"}.`);
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
    public listenForCommand(core: Core, raw: string, userId: string, message: Discord.Message): void {
        // TODO: Link to .env
        const commandPrefix = "%";
        let substrings: string[] = raw.split(" ");
        // Does the line start with the defined prefix?
        if (substrings[0] != commandPrefix) {
            // Ignore this line
            return;
        }
        // Check if valid command
        if (!this.commandRegistry.hasKey(substrings[1])) {
            // Send usage information to user
            return;
        }
        // Try and run command
        try {
            let command: AbstractCommand | undefined  = this.commandRegistry.getValue(substrings[1]);
            if (command === undefined) {
                console.log("Command undefined...");
            } else {
                command.called(core, parseInt(userId, 10), substrings.slice(1));
            }
        } catch (err) {
            console.error(err);
        }
        return;
    }

}