import { CurlCache } from "../src/cache";

declare module "@digibear/rhost-wrapper" {
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

  export class API {
    cash: CurlCache;
    url: string;
    user: string;
    password: string;
    address: string;
    port: number;
    private _curl(command: string, options: curlOptions): Promise<curlResponse>;
    post(command: string, options: curlOptions): Promise<curlResponse>;
    get(command: string, options: curlOptions): Promise<curlResponse>;

    constructor(
      user: string,
      password: string,
      address: string,
      port: number,
      encode: Boolean
    );
  }
}
