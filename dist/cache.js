"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CurlCache {
    /**
     * new Cache()
     * @param TTLCheck How often the cache should check for stale entries.
     */
    constructor(ttlCheck) {
        this._ttlCheck = ttlCheck || 600;
        this._cache = new Map();
        // Start the cache TTL timer.
        this._timeout = setInterval(() => {
            if (this._cache.keys()) {
                const time = new Date();
                for (const key of Array.from(this._cache.keys())) {
                    const entry = this._cache.get(key);
                    if (time.getTime() >= entry.ms) {
                        this._cache.delete(key);
                    }
                }
            }
        }, this._ttlCheck);
    }
    set(key, value, ttl = 2000) {
        const time = new Date();
        const entry = Object.assign(Object.assign({}, value), { ms: time.getTime() + ttl });
        this._cache.set(key, entry);
        return this._cache.get(key).payload;
    }
    get(key) {
        return this._cache.get(key).payload;
    }
    has(key) {
        return this._cache.has(key);
    }
    stop() {
        clearInterval(this._timeout);
    }
}
exports.CurlCache = CurlCache;
exports.default = new CurlCache();
//# sourceMappingURL=cache.js.map