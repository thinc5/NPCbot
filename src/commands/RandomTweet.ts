import Core from "../cores/Core";
import AbstractCommand from "./AbstractCommand";

export class RandomTweet extends AbstractCommand {

    public constructor(call: string, description: string, usage: string) {
        super(call, description, usage);
    }

    /**
     * Reply to user with random tweet.
     * @param channelId to send response to.
     * @param args of argument.
     */
    public async called(core: Core, channelId: number, args: string[]): Promise<void> {
        // This command does not accept arguments
        if (args !== []) {
            // Send usage
        }
        core.getTwitterInstance().getRandomTweet("Node.js", (tweet) => void {
            // w t f
        });
    }
}
