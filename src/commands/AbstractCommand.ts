import Discord from "discord.js";

import Core from "../cores/Core";

/**
 * Base class for commands.
 */
export default abstract class AbstractCommand {

    private call: string;
    private description: string;
    private usage: string;
    private numParams: number

    public constructor(call: string, description: string, usage: string, numParams: number) {
        this.description = description;
        this.usage = usage;
        this.call = call;
        this.numParams = numParams;
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

    public getNumParams(): number {
        return this.numParams;
    }

    public abstract called(core: Core, channel: string, numParams: string[]): void;

}
