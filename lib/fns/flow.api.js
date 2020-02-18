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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var display_fn_1 = require("./display.fn");
var state_api_1 = require("./state.api");
/**
 *
 * sequence allows asynchronous steps to run sequentially.
 *
 * A sequence runs each step one after the other until finsihsed.
 *
 * A step in the sequence can call next(flow) to pass the flow on to the next step in the sequence
 * OR
 * next(flow, sequence, 'stepN') to pass the flow into another sequence at a particular step.
 *
 * TODO: To run multiple steps in parallel, wrap the steps in an array ... eg.
 *
 * sequence({
 *  step1,
 *  step2,
 *  parallel1: [ // TODO <------------------
 *    step3a, step3b
 *  ],
 *  step4
 * })
 */
// displays the flow - but maps the flow unchanged
exports.displayFlowAndMap = function (flow, cb) {
    console.log(flow);
    cb(flow);
    return true;
};
// displays the body (payload) of the flow - but maps the flow unchanged
exports.displayBodyAndMap = function (flow, cb) {
    console.log(flow.payload);
    cb(flow);
    return true;
};
// displays a message - but maps the flow unchanged
exports.displayAndMap = function (msg) { return function (flow, cb) {
    console.log(msg);
    cb(flow);
    return true;
}; };
// waits a duration but then maps the flow unchanged
exports.wait = function (duration) { return function (flow, cb) {
    setTimeout(function () { return cb(flow); }, duration);
    return true;
}; };
// generates a random number and maps that to the output
exports.fromRandom = function (flow, cb) {
    var r = Math.random();
    var newFlow = __assign(__assign({}, flow), { payload: r });
    cb(newFlow);
    return true;
};
// dispatches the flow as if it were an action
exports.dispatchAsAction = function (flow, cb) {
    state_api_1.dispatch(flow);
    cb(flow);
    return true;
};
// takes a mapping function that takes the flow's body and produces an output.
// the output is then wrapped back into a flow
exports.map = function (mapFn) { return function (flow, cb) {
    var newFlow = __assign(__assign({}, flow), { payload: mapFn(flow.payload) });
    cb(newFlow);
    return true;
}; };
// updates the flow's type to the passed in string
exports.updateType = function (newType) { return function (flow, cb) {
    var newFlow = __assign(__assign({}, flow), { type: newType });
    cb(newFlow);
    return true;
}; };
exports.sequence = function (stepHashMap) { return function (flow) {
    var runNextStep = function (flow, upTo, stepsKeys) {
        var steps = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            steps[_i - 3] = arguments[_i];
        }
        steps[upTo](flow, function (newFlow, sequnceFn, step) {
            var nextSequence = sequnceFn || exports.sequence(stepHashMap);
            var defaultStep = stepsKeys.length > upTo + 1
                ? stepsKeys[upTo + 1]
                : 'complete';
            var newNewFlow = __assign(__assign({}, newFlow), { step: step || defaultStep });
            return nextSequence(newNewFlow);
        });
    };
    var testNextStep = function (flow, stepsKeys) {
        var step = flow.step || undefined; // extract step if one exists
        // get the index of the step we are up to
        var upToStep1 = step
            ? stepsKeys.findIndex(function (el) { return el === step; })
            : 0;
        // if the step can't be found (-1) - then stop and log the fact
        var upTo = upToStep1 === -1
            ? (function () { console.error("Step " + step + " cannot be found"); return true; })() && undefined
            : upToStep1;
        // Run the step with the next function callback
        // The callback can take a sequence and a step for sequence / step jumping
        return upTo;
    };
    var steps = Object.keys(stepHashMap).map(function (s) { return stepHashMap[s]; });
    // Only run the next step if it's not set to complete and next step exists...
    var stepsKeys = Object.keys(stepHashMap); // create array of step names
    var upTo = flow && flow.step !== 'complete'
        ? testNextStep(flow, stepsKeys)
        : undefined;
    upTo !== undefined && upTo !== false
        ? runNextStep.apply(void 0, __spreadArrays([flow, upTo, stepsKeys], steps)) : undefined;
}; };
var flowHandlers = {};
exports.registerFlowHandlers = function (flowsObj) {
    return Object.keys(flowsObj)
        .forEach(function (key) { return flowHandlers[key] = flowHandlers[key]
        ? display_fn_1.display("Flow '" + key + "' already has a value. You must unload this current flow to load a new one.")
            && flowHandlers[key]
        : flowsObj[key]; });
};
exports.unregisterFlowHandlers = function (flowsKeyArr) {
    return flowsKeyArr
        .forEach(function (key) { delete flowHandlers[key]; });
};
exports.dispatchFlow = function (flow) {
    try {
        flowHandlers[flow.type](flow);
    }
    catch (e) {
        throw new Error("Flow " + flow.type + " does not exist");
    }
};
