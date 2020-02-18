"use strict";
/**
 * A group of functions responsible for managing route-changes and integrating them into
 * application state.
 *
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
var state_api_1 = require("./state.api");
exports.goto = function (path) {
    history.pushState(undefined, '', path);
    state_api_1.dispatch(__assign(__assign({}, exports.returnRouteObject()), { type: 'ROUTE_CHANGE' }));
    window.scrollTo(0, 0);
};
exports.manageRoutes = function () {
    // dispatch the current route
    state_api_1.dispatch(__assign({ type: 'ROUTE_CHANGE' }, exports.returnRouteObject()));
    try {
        if (window) {
            // on pop state
            window.onpopstate = function () {
                state_api_1.dispatch(__assign(__assign({}, exports.returnRouteObject()), { type: 'ROUTE_CHANGE' }));
                window.scrollTo(0, 0);
            };
            // on hash change
            window.onhashchange = function () {
                state_api_1.dispatch(__assign(__assign({}, exports.returnRouteObject()), { type: 'ROUTE_CHANGE' }));
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
exports.returnRouteObject = function () {
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
