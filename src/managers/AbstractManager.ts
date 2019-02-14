import Core from "../cores/CoreDiscord";

export default abstract class AbstractManager {

    protected main: Core;

    public constructor(core: Core) {
        this.main = core;
    }

}
