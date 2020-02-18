"use strict";
/**
 * A functional pipe function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (x) { return fns.reduce(function (v, f) { return f(v); }, x); };
};
