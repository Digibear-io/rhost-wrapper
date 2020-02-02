export interface curlOptions {
    method?: "GET" | "POST";
    time?: number;
    parse?: "parse" | "noparse" | "anisparse" | "ansinoparse" | "ansionly";
    encode?: "yes" | "no";
    ttl?: number;
    cacheCheck?: number;
}
export interface curlResponse {
    status: string;
    ok: boolean;
    message: string;
    data: string;
}
export declare class API {
    private user;
    private password;
    private port;
    private address;
    private url;
    private cache;
    private encode;
    constructor({ user, password, address, port, encode }: {
        user: string;
        password: string;
        address?: string;
        port?: number;
        encode?: Boolean;
    });
    initCache(): Promise<void>;
    /**
     * Make an http call to the fetch api.
     * @param options The settings passed to the fetch call.
     * @param options.time (POST) The time to queue the action before
     * it's handled.
     * @param options.method Either `Post`, or `Get`.
     */
    private _curl;
    /**
     * make a get request from the Rhost HTTP API
     * @param command The command to be passed to the server.
     * @param options Additional options to be setnt over the API.
     */
    get(command: string, options?: curlOptions): Promise<curlResponse>;
    /**
     * make a get request from the Rhost HTTP API
     * @param command The command to be passed to the server.
     */
    post(command: string, options?: curlOptions): Promise<curlResponse>;
}
