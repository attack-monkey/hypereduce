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
var keys_fn_1 = require("./keys.fn");
exports.combineReducers = function (state, action) { return function (fns) {
    return keys_fn_1.keys(fns).reduce(function (ac, key) {
        var _a;
        return (__assign(__assign({}, ac), (_a = {}, _a[key] = fns[key](state[key], action), _a)));
    }, {});
}; };
