import AbstractRegistry from "./AbstractRegistry";
import AbstractCommand from "../commands/AbstractCommand";

/**
 * Extends @see AbstractRegistry
 * @classdesc Registry that contains commands to be fulfilled by the CommandManager.
 * @see CommandManager
 */
export default class CommandRegistry extends AbstractRegistry<AbstractCommand> {

    public constructor() {
        super();
    }

    /**
     * Register a command.
     * @param command to be registered.
     * @returns boolean indicating success.
     */
    public registerCommand(command: AbstractCommand): boolean {
        console.log(command.getCall());
        return this.addEntry(command.getCall(), command);
    }

    /**
     * Remove a command.
     * @param command to be removed.
     * @returns boolean indicating success.
     */
    public unregisterCommand(key: string): boolean {
        return this.removeEntry(key);
    }

    /** 
     * Register multiple commands.
     * @param commands to register.
     * @returns boolean indicating success.
     */
    public registerCommands(commands: AbstractCommand[]) {
        // Iterate through each command and attempt to register.
        commands.forEach(command => {
            if (!this.registerCommand(command)) {
                console.log(`Failed to register: ${command.getCall}`)
                return false;
            }
        });
        return true;
    }
    
}
