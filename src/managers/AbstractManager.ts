import Core from "../cores/Core";
import Filesystem from "fs";

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
    }

    /**
     * Reads files from target directory and generates their path.
     */
    protected async generateImports(): Promise<void> {
        return new Promise((resolve, reject) => {
            Filesystem.readdir(this.PATH, (error, paths) => {
                for (const path of paths) {
                    // Only add if path hasn't already been added.
                    if (!(this.importPaths.includes(path))) {
                        this.importPaths.push(path);
                    }
                };
                if (this.importPaths.length > 0) {
                    resolve();
                }
                reject(new Error("Unable to import any files."));
            });
        });
    }

    /**
     * Update imports.
     */
    public update(): void {
        this.generateImports();
    }

}
