"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var die_fn_1 = require("./die.fn");
exports.isArray = function (maybe) { return typeof maybe === 'object' && Array.isArray(maybe); };
exports.mustBeNumber = function (maybe) { return exports.mustBe('number')(maybe); };
exports.mustBeString = function (maybe) { return exports.mustBe('string')(maybe); };
exports.mustBeBoolean = function (maybe) { return exports.mustBe('boolean')(maybe); };
exports.is = function (pType) { return function (maybe) { return typeof maybe === pType; }; };
exports.mustBe = function (pType) { return function (maybe) {
    return exports.is(pType)(maybe)
        ? maybe
        : die_fn_1.die(maybe + " must be a " + pType + "!");
}; };
exports.mustBeArrayOf = function (aType) { return function (maybe) {
    return exports.isArray(maybe) && maybe.every(function (item) { return typeof item === aType; })
        ? maybe
        : die_fn_1.die(maybe + " must be an array of " + aType);
}; };
exports.mustBeArrayOfNumbers = function (maybe) { return exports.mustBeArrayOf('number')(maybe); };
exports.mustBeArrayOfStrings = function (maybe) { return exports.mustBeArrayOf('string')(maybe); };
exports.mustBeArrayOfBooleans = function (maybe) { return exports.mustBeArrayOf('boolean')(maybe); };
