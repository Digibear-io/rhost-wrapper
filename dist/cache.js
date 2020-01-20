"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CurlCache = /** @class */ (function () {
    /**
     * new Cache()
     * @param TTLCheck How often the cache should check for stale entries.
     */
    function CurlCache(ttlCheck) {
        var _this = this;
        this._ttlCheck = ttlCheck || 600;
        this._cache = new Map();
        // Start the cache TTL timer.
        this._timeout = setInterval(function () {
            if (_this._cache.keys()) {
                var time = new Date();
                for (var _i = 0, _a = Array.from(_this._cache.keys()); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var entry = _this._cache.get(key);
                    if (time.getTime() >= entry.ms) {
                        _this._cache.delete(key);
                    }
                }
            }
        }, this._ttlCheck);
    }
    CurlCache.prototype.set = function (key, value, ttl) {
        if (ttl === void 0) { ttl = 2000; }
        var time = new Date();
        var entry = __assign(__assign({}, value), { ms: time.getTime() + ttl });
        this._cache.set(key, entry);
        return this._cache.get(key).payload;
    };
    CurlCache.prototype.get = function (key) {
        return this._cache.get(key).payload;
    };
    CurlCache.prototype.has = function (key) {
        return this._cache.has(key);
    };
    CurlCache.prototype.stop = function () {
        clearInterval(this._timeout);
    };
    return CurlCache;
}());
exports.CurlCache = CurlCache;
exports.default = new CurlCache();
//# sourceMappingURL=cache.js.map