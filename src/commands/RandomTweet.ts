
import AbstractCommand from "./AbstractCommand";

export class RandomTweet extends AbstractCommand {

    public constructor(call: string, description: string, usage: string) {
        super(call, description, usage);
    }

    public called(channelId: number): void {
        throw new Error("Method not implemented.");
    }
}
