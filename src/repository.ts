import type { IConfigRepository } from '@ostro/contracts/config/repository';

import ObjectGet from 'lodash.get';
import ObjectSet from 'lodash.set';
import { Macroable } from '@ostro/support/macro';

/** Symbol for internal configuration storage. */
const kConfig: unique symbol = Symbol('config');

/**
 * Configuration repository providing dot-notated get/set access
 * with proxy-based property delegation.
 */
class Config extends Macroable implements IConfigRepository {
    /** Internal configuration storage. */
    [kConfig]: Record<string, unknown>;

    /**
     * Create a new configuration repository instance.
     *
     * @param $items - Initial configuration items.
     */
    constructor($items: Record<string, unknown> = {}) {
        super();
        Object.defineProperty(this, kConfig, {
            value: $items,
            writable: true,
        });
    }

    /**
     * Get the specified configuration value.
     *
     * @typeParam T - The expected return type.
     * @param configPath - The key or dot-notated path.
     * @param defaultValue - The default fallback value.
     * @returns The resolved configuration value.
     */
    get<T = unknown>(configPath: string, defaultValue: T | null = null): T | null {
        return ObjectGet(this[kConfig], configPath, defaultValue) as T | null;
    }

    /**
     * Determine if the given configuration value exists.
     *
     * @param key - The key or dot-notated path.
     * @returns True if exists, false otherwise.
     */
    public has(key: string): boolean {
        return ObjectGet(this[kConfig], key) !== undefined;
    }

    /**
     * Set a given configuration value.
     *
     * @param key - The key or dot-notated path.
     * @param value - The value to store.
     * @returns The updated storage object.
     */
    set(key: string, value: unknown): unknown {
        return ObjectSet(this[kConfig], key, value);
    }

    /**
     * Proxy getter handler — delegates property reads to config lookups.
     *
     * @param target - The config repository target.
     * @param method - The property name to read.
     * @returns The resolved value.
     */
    public __get(target: Config, method: string): unknown {
        return target.get(method);
    }

    /**
     * Proxy setter handler — delegates property writes to config storage.
     *
     * @param target - The config repository target.
     * @param key - The property key to write.
     * @param value - The value to store.
     * @returns The result of setting the value.
     */
    public __set(target: Config, key: string, value: unknown): unknown {
        return target.set(key, value);
    }
}

export default Config;
