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
        }, 1000 * 4);   // Only update every 4 seconds.
        setInterval(() => {
            this.avatarUpdate();
        }, (1000 * 30 * 60)); // Only update every 30 seconds.
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
        this.core.updateActivity(`[${bar}] ${this.progress}%`);
        setTimeout(() => {
            this.core.updateActivity(`% help`);
        }, 2000);
    }

    /**
     * Update bots avatar based off status.
     */
    private avatarUpdate(): void {
        if (this.progress < 50) {
            this.core.updateAvatar("res/main.png");
        } else if (this.progress < 60) {
            this.core.updateAvatar("res/soy.png");
        } else if (this.progress < 80) {
            this.core.updateAvatar("res/smug.png");
        } else {
            this.core.updateAvatar("res/angry.png");
        }
    }

}
