"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class API {
    constructor({ user, password, address = "127.0.0.1", port = 2222, encode = false }) {
        this.user = user || "";
        this.encode = encode;
        this.password = password || "";
        this.port = port;
        this.address = address;
        this.url = `http://${this.address}:${this.port}`;
    }
    initCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache = (yield Promise.resolve().then(() => __importStar(require("./cache")))).default;
        });
    }
    /**
     * Make an http call to the fetch api.
     * @param options The settings passed to the fetch call.
     * @param options.time (POST) The time to queue the action before
     * it's handled.
     * @param options.method Either `Post`, or `Get`.
     */
    _curl(command, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parse = "parse", method = "GET", time = 0 } = options || {};
            const curlString = `curl -X ${method} --user "${this.user}:${this.password}" -H "Exec: ${command}" -H "Encode: ${this.encode ? "Yes" : "No"}" -H "Time: ${time}" -H "Parse: ${parse}" --head ${this.url}`;
            if (this.cache && this.cache.has(curlString)) {
                return this.cache.get(curlString);
            }
            else {
                // If the curl operation fails to respond after 20 seconds, cancel
                // the request and return with a Promise.Reject.
                const timeout = setTimeout(() => {
                    return Promise.reject({ message: "Curl Operation timeout" });
                }, 20000);
                return new Promise((resolve, reject) => {
                    child_process_1.exec(curlString, (error, stdout) => {
                        if (error)
                            reject(error);
                        clearTimeout(timeout);
                        const RegexStatus = stdout.match(/HTTP\/1.1\s(\d+)/);
                        const RegexExec = stdout.match(/Exec:\s(.*)/);
                        const RegexReturn = stdout.match(/Return:\s(.*)/);
                        resolve({
                            status: RegexStatus ? RegexStatus[1] : "",
                            ok: RegexStatus ? (RegexStatus[1] === "200" ? true : false) : false,
                            message: RegexExec ? RegexExec[1] : "",
                            data: RegexReturn ? RegexReturn[1] : ""
                        });
                        if (this.cache) {
                            this.cache.set(curlString, {
                                ttl: 2000,
                                payload: {
                                    status: RegexStatus ? RegexStatus[1] : "",
                                    ok: RegexStatus
                                        ? RegexStatus[1] === "200"
                                            ? true
                                            : false
                                        : false,
                                    message: RegexExec[1],
                                    data: RegexReturn ? RegexReturn[1] : ""
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    /**
     * make a get request from the Rhost HTTP API
     * @param command The command to be passed to the server.
     * @param options Additional options to be setnt over the API.
     */
    get(command, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this._curl(command, options);
            if (!results.ok)
                throw new Error(results.message);
            return results;
        });
    }
    /**
     * make a get request from the Rhost HTTP API
     * @param command The command to be passed to the server.
     */
    post(command, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options.method = "POST";
            const results = yield this._curl(command, options);
            if (!results.ok)
                throw new Error(results.message);
            return results;
        });
    }
}
exports.API = API;
//# sourceMappingURL=api.js.map