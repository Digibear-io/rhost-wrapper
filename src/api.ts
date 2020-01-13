import { exec } from "child_process";
import cache, { CurlCache } from "./cache";

// load the .env file

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

export default class API {
  private user: string;
  private password: string;
  private port: number;
  private address: string;
  private url: string;
  private cache: CurlCache;
  private encode: Boolean;

  constructor({
    user,
    password,
    address = "127.0.0.1",
    port = 2222,
    encode = false
  }: {
    user: string;
    password: string;
    address: string;
    port: number;
    encode: Boolean;
  }) {
    this.cache = cache;
    this.user = user || "";
    this.encode = encode;
    this.password = password || "";
    this.port = port;
    this.address = address;
    this.url = `http://${this.address}:${this.port}`;
  }

  /**
   * Make an http call to the fetch api.
   * @param options The settings passed to the fetch call.
   * @param options.time (POST) The time to queue the action before
   * it's handled.
   * @param options.method Either `Post`, or `Get`.
   */
  private async _curl(
    command: string,
    options?: curlOptions
  ): Promise<curlResponse> {
    const { parse = "parse", method = "GET", time = 0 } = options || {};
    const curlString = `curl -X ${method} --user "${this.user}:${
      this.password
    }" -H "Exec: ${command}" -H "Encode: ${
      this.encode ? "Yes" : "No"
    }" -H "Time: ${time}" -H "Parse: ${parse}" --head ${this.url}`;

    if (this.cache.has(curlString)) {
      return this.cache.get(curlString);
    } else {
      // If the cache fails to respond after 20 seconds, cancel
      // the request and return with a Promise.Reject.
      const timeout = setTimeout(() => {
        return Promise.reject({ message: "Curl Operation timeout" });
      }, 20000);

      return new Promise((resolve, reject) => {
        exec(curlString, (error, stdout) => {
          if (error) reject(error);

          clearTimeout(timeout);
          const RegexStatus = stdout.match(/HTTP\/1.1\s(\d+)/);
          const RegexExec = stdout.match(/Exec:\s(.*)/);
          const RegexReturn = stdout.match(/Return:\s(.*)/);

          resolve({
            status: RegexStatus ? RegexStatus[1] : "",
            ok: RegexStatus![1] === "200" ? true : false,
            message: RegexExec![1],
            data: RegexReturn ? RegexReturn[1] : ""
          });

          this.cache.set(curlString, {
            ttl: 2000,
            payload: {
              status: RegexStatus ? RegexStatus[1] : "",
              ok: RegexStatus![1] === "200" ? true : false,
              message: RegexExec![1],
              data: RegexReturn ? RegexReturn[1] : ""
            }
          });
        });
      });
    }
  }

  /**
   * make a get request from the Rhost HTTP API
   * @param command The command to be passed to the server.
   * @param options Additional options to be setnt over the API.
   */
  async get(command: string, options: curlOptions): Promise<curlResponse> {
    const results = await this._curl(command, options);

    if (!results.ok) throw new Error(results.message);
    return results;
  }

  /**
   * make a get request from the Rhost HTTP API
   * @param command The command to be passed to the server.
   */
  async post(command: string, options: curlOptions): Promise<curlResponse> {
    options.method = "POST";
    const results = await this._curl(command, options);

    if (!results.ok) throw new Error(results.message);
    return results;
  }
}
