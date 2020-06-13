"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const curl_1 = require("@digibear/curl");
class API {
    constructor({ user, password, address = "127.0.0.1", port = 2222, encode = false, }) {
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
            const stdout = yield curl_1.curl(this.url, {
                mode: method,
                headers: {
                    Exec: command,
                    Encode: this.encode ? "Yes" : "No",
                    Time: time,
                    Parse: parse,
                },
                user: {
                    user: this.user,
                    password: this.password,
                },
                flags: ["--head"],
            });
            const RegexStatus = stdout.match(/HTTP\/1.1\s(\d+)/);
            const RegexExec = stdout.match(/Exec:\s(.*)/);
            const RegexReturn = stdout.match(/Return:\s(.*)/);
            return {
                status: RegexStatus ? RegexStatus[1] : "",
                ok: RegexStatus ? (RegexStatus[1] === "200" ? true : false) : false,
                message: RegexExec ? RegexExec[1] : "",
                data: RegexReturn ? RegexReturn[1] : "",
            };
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