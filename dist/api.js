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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var cache_1 = __importDefault(require("./cache"));
var API = /** @class */ (function () {
    function API(_a) {
        var user = _a.user, password = _a.password, _b = _a.address, address = _b === void 0 ? "127.0.0.1" : _b, _c = _a.port, port = _c === void 0 ? 2222 : _c, _d = _a.encode, encode = _d === void 0 ? false : _d;
        this.cache = cache_1.default;
        this.user = user || "";
        this.encode = encode;
        this.password = password || "";
        this.port = port;
        this.address = address;
        this.url = "http://" + this.address + ":" + this.port;
    }
    /**
     * Make an http call to the fetch api.
     * @param options The settings passed to the fetch call.
     * @param options.time (POST) The time to queue the action before
     * it's handled.
     * @param options.method
     */
    API.prototype._curl = function (command, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, parse, _c, method, _d, time, curlString;
            var _this = this;
            return __generator(this, function (_e) {
                _a = options || {}, _b = _a.parse, parse = _b === void 0 ? "parse" : _b, _c = _a.method, method = _c === void 0 ? "GET" : _c, _d = _a.time, time = _d === void 0 ? 0 : _d;
                curlString = "curl -X " + method + " --user \"" + this.user + ":" + this.password + "\" -H \"Exec: " + command + "\" -H \"Encode: " + (this.encode ? "Yes" : "No") + "\" -H \"Time: " + time + "\" -H \"Parse: " + parse + "\" --head " + this.url;
                if (this.cache.has(curlString)) {
                    return [2 /*return*/, this.cache.get(curlString)];
                }
                else {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            child_process_1.exec(curlString, function (error, stdout) {
                                if (error)
                                    reject(error);
                                var RegexStatus = stdout.match(/HTTP\/1.1\s(\d+)/);
                                var RegexExec = stdout.match(/Exec:\s(.*)/);
                                var RegexReturn = stdout.match(/Return:\s(.*)/);
                                resolve({
                                    status: RegexStatus ? RegexStatus[1] : "",
                                    ok: RegexStatus[1] === "200" ? true : false,
                                    message: RegexExec[1],
                                    data: RegexReturn ? RegexReturn[1] : ""
                                });
                                _this.cache.set(curlString, {
                                    ttl: 2000,
                                    payload: {
                                        status: RegexStatus ? RegexStatus[1] : "",
                                        ok: RegexStatus[1] === "200" ? true : false,
                                        message: RegexExec[1],
                                        data: RegexReturn ? RegexReturn[1] : ""
                                    }
                                });
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * make a get request from the Rhost HTTP API
     * @param command The command to be passed to the server.
     */
    API.prototype.get = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._curl(command)];
                    case 1:
                        results = _a.sent();
                        if (!results.ok)
                            throw new Error(results.message);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * make a get request from the Rhost HTTP API
     * @param command The command to be passed to the server.
     */
    API.prototype.post = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._curl(command, { method: "POST" })];
                    case 1:
                        results = _a.sent();
                        if (!results.ok)
                            throw new Error(results.message);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    return API;
}());
exports.default = API;
//# sourceMappingURL=api.js.map