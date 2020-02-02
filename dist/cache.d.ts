import { curlResponse } from "./api";
export interface CurlCacheEntry {
    ttl: number;
    payload: curlResponse;
}
export interface CurlCacheStore {
    ttl: number;
    ms: number;
    payload: curlResponse;
}
export declare class CurlCache {
    private _ttlCheck;
    private _cache;
    private _timeout;
    /**
     * new Cache()
     * @param TTLCheck How often the cache should check for stale entries.
     */
    constructor(ttlCheck?: number);
    set(key: string, value: CurlCacheEntry, ttl?: number): curlResponse;
    get(key: string): curlResponse;
    has(key: string): boolean;
    stop(): void;
}
declare const _default: CurlCache;
export default _default;
