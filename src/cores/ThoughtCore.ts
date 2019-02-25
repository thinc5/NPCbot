import Core from "./Core";

/**
 * @classdesc Facilitates original thought :^)
 */
export default class ThoughtCore {

    /**
     * Reference to core.
     */
    private core: Core;

    /**
     * Current progress to thought completion.
     */
    private progress: number;

    /**
     * Interval reference to update activity.
     */
    private activityInterval: any;

    public constructor(core: Core) {
        this.core = core;
        this.progress = 55;
    }

    /**
     * Start thinking when core is ready.
     */
    public start(): void {
        this.activityInterval = setInterval(() => {
            this.progressUpdate();
        }, 4000);
        // this.moodUpdate();
    }

    /**
     * Private retrieval of unrelated materials.
     */
    private retrieveMaterial(): void {
        return;
    }

    /**
     * Think time...
     */
    private processMaterial(): void {
        return;
    }

    /**
     * Update the bot's status.
     */
    private progressUpdate(): void {
        let bar = "..........";
        const base = "##########";
        const bars = Math.floor(this.progress / 10);
        bar = base.substr(0, bars) + bar.substr(bars);
        this.core.updateActivity(`Opinion [${bar}] ${this.progress}%`);
        setTimeout(() => {
            this.core.updateActivity(`% register to sign up for knowledge`);
        }, 2000);
    }

    /**
     * Update bots avitar based off status.
     */
    private moodUpdate(): void {
        setTimeout(() => {
            this.core.updateAvatar("res/angry.png");
        }, 5000);
    }

}
