"use strict";
/**
 * Console.logs but also returns the passed in value - making it a psuedo-pure function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.display = function (msg) { console.log(msg); return msg; };
