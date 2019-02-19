
/**
 * @classdesc Basic Registry implementation for storing any type.
 */
export default abstract class AbstractRegistry<T> {
  
    protected registry: Map<string, T>;

    public constructor() {
        this.registry = new Map<string, T>();
    }

    /**
     * Return a copy of the registry values.
     */
    public getRegistry(): Map<string, T> {
        return this.registry;
    }

    /**
     * Gets the current total number of entries in the registry.
     * @returns number of entries in registry.
     */
    public getRegistrySize(): number {
        return this.registry.size;
    }

    /**
     * Query if there is an entry with provided key.
     * @param key key of entry to query.
     * @returns boolean true if entry exists, false if it does not.
     */
    public hasKey(key: string): boolean {
        return this.registry.has(key);
    }

    /**
     * Return the value of supplied key or undefined if entry does not exist.
     * @param key of requested entry
     * @returns T value of entry or undefined
     */
    public getValue(key: string): T | undefined {
        return this.registry.get(key);
    }

    /**
     * Register a new entry in the register.
     * @param key for new entry.
     * @param value value of new entry.
     * @returns boolean indicating success.
     */
    public addEntry(key: string, value: T): boolean {
        // Check if entry with key already exists
        if (this.hasKey(key)) {
            return false;
        }
        // Create new entry
        this.registry.set(key, value);
        return true;
    }

    /**
     * Attempt to remove an entry from register.
     * @param key for new entry.
     * @returns boolean indicating success.
     */
    public removeEntry(key: string): boolean {
        return this.registry.delete(key);
    }

}
