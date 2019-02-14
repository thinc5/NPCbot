/**
 * Base class for potential commands.
 */
export default abstract class Command {

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

    public abstract called(channelId: number): void;

}
