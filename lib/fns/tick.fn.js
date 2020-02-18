"use strict";
/**
 * tick adds a task to the javaScript task queue, which executes after all other
 * synchronous code and microTasks, etc. complete.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tick = function (f) { return setTimeout(f, 0); };
