"use strict";
/**
 * A group of functions responsible for managing application state
 */
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
var display_fn_1 = require("./display.fn");
var exists_fn_1 = require("./exists.fn");
var keys_fn_1 = require("./keys.fn");
// -- mutables --
var id = 0; // id for subscriptions
var appState; // the held application state
var dynamicStateStore; // the held dynamic state object
var dynamicStateSubscriptions = {}; // subscriptions for full state
var connectionsStore = {}; // key / val store of connectors and their state at the given connector node
var connectionsSubscriptions = {}; // 1:1 subscriptions from a node in the state to a registered connector
// -- getting full state --
exports.fromDynamicState = function (fn) { return fn(appState); };
exports.dynamicState = {
    subscribe: function (fn) {
        dynamicStateSubscriptions[id] = fn;
        id++;
        return id - 1;
    },
    unsubscribe: function (key) { return delete dynamicStateSubscriptions[key]; }
};
var emitToStateSubscriptions = function (state) {
    return keys_fn_1.keys(dynamicStateSubscriptions)
        .forEach(function (sub) { return dynamicStateSubscriptions[sub](state); });
};
// -- managing connections
exports.connect = function (key, fn) {
    connectionsSubscriptions[key]
        ? display_fn_1.display("Connections must be unique " + key + " has already been registered")
        : connectionsSubscriptions[key] = fn;
};
exports.disconnect = function (key) {
    delete connectionsStore[key];
    delete connectionsSubscriptions[key];
    return true;
};
var emitToConnections = function (connects, state) {
    (connects || []) // For any connects annotations...
        .forEach(function (connector) {
        connectionsStore[connector] = state; // save the result to the key / val store
        setTimeout(function () {
            return connectionsSubscriptions[connector]
                && typeof connectionsSubscriptions[connector] === 'function'
                ? connectionsSubscriptions[connector](state) // emit to the subscriptions
                : undefined;
        }, 0);
    });
    return true;
};
exports.d = function (node) { return function (state, action) {
    var _a;
    var init = node.init, connects = node.connects, _ = node._, actions = node.actions;
    var actionKeys = keys_fn_1.keys(actions || {});
    var res = ((_a = action) === null || _a === void 0 ? void 0 : _a.type) && exists_fn_1.exists(state) && actionKeys.includes(action.type)
        ? (actions || {})[action.type](state, action) // action.type matches - fire the function!!
        : actionKeys.includes('$') && action
            ? (actions || {}).$(state, action) // $ wild card detected - fire the function
            : exists_fn_1.exists(_) && action
                ? rootReduce(state, action)(_) // _ = passdown
                : exists_fn_1.exists(state)
                    ? state // else return state (if it exists)
                    : init || undefined; // else the initial value
    emitToConnections((connects || []), res);
    // console.log(`action ${action?.type}, state ${pretty(state)} ${exists(state)}, res ${pretty(res)}`)
    return res;
}; };
var rootReduce = function (state, action) { return function (input) {
    return typeof input === 'object' && Array.isArray(input)
        ? input.map(function (item, i) { return rootReduce(state && state[i], action)(item); })
        : typeof input === 'object'
            ? keys_fn_1.keys(input)
                .reduce(function (ac, key) {
                var _a;
                return (__assign(__assign({}, ac), (_a = {}, _a[key] = rootReduce(state && state[key], action)(input[key]), _a)));
            }, {})
            : typeof input === 'function'
                ? input(state, action)
                : input;
}; };
// -- state managers --
exports.manageState = function (input) {
    appState = rootReduce(undefined, undefined)(input);
    dynamicStateStore = input;
    return true;
};
exports.dispatch = function (action) {
    appState = rootReduce(appState, action)(dynamicStateStore);
    emitToStateSubscriptions(appState);
    return true;
};
