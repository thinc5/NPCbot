import Core from "../cores/Core";
import Filesystem from "fs"

/**
 * @classdesc Loads and manages instances of objects.
 */
export default abstract class AbstractManager {

    protected main: Core;
    protected readonly PATH: string;
    protected importPaths: string[];

    public constructor(core: Core, path: string) {
        this.main = core;
        this.PATH = path;
        this.importPaths = [];
        this.generateImports();
    }

    /**
     * Reads files from target directory and generates their path.
     */
    private generateImports(): void {
        Filesystem.readdirSync(this.PATH).forEach(path => {
            // Only add if path hasn't already been added.
            if (!this.importPaths.includes(path)) {
                this.importPaths.join(path);
            }
            //DEBUG
            console.log(this.PATH);
            console.log(this.importPaths);
        });
        
    }

    /**
     * Update imports.
     */
    public update(): void {
        this.generateImports();
    }

}
