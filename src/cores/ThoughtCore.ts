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
        this.progress = 0;
        this.activityInterval = setInterval(this.progressUpdate, 1000);
    }

    /**
     * Private retrieval of unrelated materials. 
     */
    private retrieveMaterial(): void {

    }

    /**
     * Think time...
     */
    private processMaterial(): void {
        
    }

    /**
     * Update the bot's status.
     */
    private progressUpdate(): void {
        this.core.updateActivity(`Thinking: ${this.progress}%`);
        setTimeout(this.core.updateActivity, 1000, `% register to sign up for knowledge`);
    }


}