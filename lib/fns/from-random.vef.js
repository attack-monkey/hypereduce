"use strict";
/**
 * Value Emitting Function that produces a random number.
 * Generates one random number and emits it into the passed
 * in function. Synchronously just returns true to keep it pure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromRandom = function (f) {
    var r = Math.random();
    f(r);
    return true;
};
