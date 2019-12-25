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
var apply_fn_1 = require("./apply.fn");
var keys_fn_1 = require("./keys.fn");
var subs = {};
var store;
var reducer;
exports.getStore = function () { return store; };
exports.connect = function (key, fn) { subs[key] = fn; };
exports.disconnect = function (key) { return delete subs[key]; };
exports.dispatch = function () {
    var actions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        actions[_i] = arguments[_i];
    }
    actions.forEach(function (action) {
        store =
            exports.hypeReduceCore(store, action)(reducer);
    });
};
exports.goto = function (path) {
    history.pushState(undefined, '', path);
    exports.dispatch(__assign(__assign({}, returnRouteObject()), { type: 'ROUTE_CHANGE' }));
    window.scrollTo(0, 0);
};
exports.hypeReduce = function (init, reduceObject) {
    manageRoutes();
    store = init;
    reducer = reduceObject;
    exports.dispatch(__assign({ type: 'ROUTE_CHANGE' }, returnRouteObject()));
};
exports.hypeReduceCore = function (state, action, pKey) {
    if (pKey === void 0) { pKey = undefined; }
    return function (mirror) {
        return isObject(mirror)
            ? mainReducer(state, action, pKey)(mirror)
            : die("Each level of the reducer pattern must be an object. Instead " + (pKey || 'root reducer') + " recieved " + pretty(mirror) + ".\nThis can occur: \n- when a reducer has not been assigned an object");
    };
};
var mainReducer = function (state, action, pKey) {
    if (pKey === void 0) { pKey = undefined; }
    return function (mirror) {
        return apply_fn_1.apply(keys_fn_1.keys(mirror).reduce(function (ac, key) {
            return apply_fn_1.apply(itemIs(state, key, mirror, action), function (itemType) {
                return ac.instruction === 'stop'
                    ? ac
                    : itemType === 'connector'
                        ? { newState: ac.newState, instruction: 'keep-going' }
                        : itemType === 'passiveConnector'
                            ? { newState: ac.newState, instruction: 'stop' }
                            : itemType === 'dormant-action'
                                ? { newState: ac.newState, instruction: 'keep-going' }
                                : itemType === 'active-action'
                                    ? { newState: routeOnItem(itemType)(state, key, mirror, action, pKey), instruction: 'stop' }
                                    : {
                                        newState: Object.assign({}, ac.newState, routeOnItem(itemType)(state, key, mirror, action, pKey)),
                                        instruction: 'keep-going'
                                    };
            });
        }, { newState: state, instruction: 'keep-going' }), function (res) {
            var connector = mirror.connect || mirror.passiveConnect;
            if (res.instruction === 'stop' && connector && subs[connector]) {
                setTimeout(function () { return subs[connector](res.newState); }, 0);
            }
            return res.newState;
        });
    };
};
var itemIs = function (state, key, mirror, action) {
    return apply_fn_1.apply(key === 'connect'
        ? 'connector'
        : key === 'passiveConnect'
            ? 'passiveConnector'
            : key === '$'
                ? 'active-action'
                : state[key] !== undefined
                    ? 'reducer'
                    : key === '_'
                        ? 'passThrough'
                        : typeof mirror[key] === 'function' && key === action.type
                            ? 'active-action'
                            : typeof mirror[key] === 'function'
                                ? 'dormant-action'
                                : 'other', function (itemType) {
        return itemType;
    });
};
var routeOnItem = function (itemType) {
    return function (state, key, mirror, action, pKey) {
        var _a;
        return itemType === 'reducer'
            ? (_a = {}, _a[key] = exports.hypeReduceCore(state[key], action, key)(mirror[key]), _a) : itemType === 'passThrough'
            ? exports.hypeReduceCore(state, action, pKey)(mirror[key])
            : itemType === 'active-action'
                ? handleAction(action, state, key, mirror[key])
                : isObject(state) && keys_fn_1.keys(state).length > 0
                    ? die(key + " must either be bound to an action-function or be one of the following: " + keys_fn_1.keys(state).join(', '))
                    : die(key + " must be bound to an action-function");
    };
};
var handleAction = function (action, state, key, fn) { return fn(state, action); };
var manageRoutes = function () {
    try {
        if (window) {
            // on pop state
            window.onpopstate = function () {
                exports.dispatch(__assign(__assign({}, returnRouteObject()), { type: 'ROUTE_CHANGE' }));
                window.scrollTo(0, 0);
            };
            // on hash change
            window.onhashchange = function () {
                exports.dispatch(__assign(__assign({}, returnRouteObject()), { type: 'ROUTE_CHANGE' }));
                window.scrollTo(0, 0);
            };
        }
    }
    catch (e) { /* no window */ }
};
var getSearchFromHash = function (hash) {
    var hashMatchArray = hash.match(/\?[^]*/);
    return hashMatchArray && Array.isArray(hashMatchArray) ? hashMatchArray[0] : undefined;
};
var extractQueryString = function (input) {
    try {
        return (input
            .match(/(&|\?)[^&]*|(&|\?)[^\n]/g)
            || [])
            .map(function (qs) { return qs.replace(/\?|&/g, ''); })
            .reduce(function (ac, qs) {
            var _a;
            return Object.assign({}, ac, (_a = {}, _a[qs.split('=')[0]] = qs.split('=')[1], _a));
        }, {});
    }
    catch (e) {
        return undefined;
    }
};
var extractQueryStringFromSearch = function () { return (function () {
    try {
        return extractQueryString(window.location.search);
    }
    catch (e) {
        return '';
    }
})(); };
var extractQueryStringFromHash = function () { return (function () {
    try {
        return extractQueryString(getSearchFromHash(window.location.hash));
    }
    catch (e) {
        return '';
    }
})(); };
var queryString = function () { return extractQueryStringFromSearch() || extractQueryStringFromHash(); };
var returnRouteObject = function () {
    var pathArrayStep1 = (function () { try {
        return window.location.pathname.split('/');
    }
    catch (e) {
        return [];
    } })();
    var lastKey = pathArrayStep1.length - 1;
    // if last path array item is '' then remove it
    var pathArrayStep2 = pathArrayStep1[lastKey] === '' ? pathArrayStep1.slice(0, lastKey) : pathArrayStep1;
    var hashArrayStep1 = (function () { try {
        return window.location.hash;
    }
    catch (e) {
        return '';
    } })()
        .replace(/\?[^]*/, '')
        .replace('#/', '')
        .split('/');
    var hashArrayStep2 = hashArrayStep1.length === 1 && hashArrayStep1[0] === ''
        ? []
        : hashArrayStep1;
    var segments = pathArrayStep2.concat(hashArrayStep2);
    return {
        segments: segments,
        queryString: queryString()
    };
};
var die = function (input) { throw new Error('hypeReduce ERROR:\n' + input); };
var pretty = function (input) { return JSON.stringify(input, null, 2); };
var isObject = function (input) { return typeof input === 'object' && !Array.isArray(input); };
