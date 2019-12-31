"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTE_CHANGE = function (state, action) { return ({
    segments: action.segments || [],
    queryString: action.queryString || {}
}); };
