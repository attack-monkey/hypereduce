"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apply_fn_1 = require("../../fns/apply.fn");
exports.REPLACE = function (location, fallback) {
    return function (state, action) {
        return apply_fn_1.apply(action.location === location
            ? action.payload
            : state, function (newState) {
            return newState === undefined
                || newState === null
                ? fallback
                : newState;
        });
    };
};
