import Core from "../cores/Core";

/**
 * Base class for commands.
 */
export default abstract class AbstractCommand {

    private call: string;
    private description: string;
    private usage: string;

    public constructor(call: string, description: string, usage: string) {
        this.description = description;
        this.usage = usage;
        this.call = call;
    }

    public getCall(): string {
        return this.call;
    }

    public getDescription(): string {
        return this.description;
    }

    public getUsage(): string {
        return this.usage;
    }

    public abstract called(core: Core, channelId: number, args: string[]): void;

}
