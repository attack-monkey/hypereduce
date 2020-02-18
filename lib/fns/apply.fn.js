"use strict";
/**
 * Takes a value and a pure unary function.
 * The value is simply passed into function as the parameter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = function (x) { return function (f) { return f(x); }; };
