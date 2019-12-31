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
var apply_fn_1 = require("../../../fns/apply.fn");
exports.DELETE = function (collectionState, action) {
    return apply_fn_1.apply(action, function (deleteAction) {
        return apply_fn_1.apply(collectionState.allIds.filter(function (id) { return id !== deleteAction.id; }), function (allIds) {
            return ({
                byId: allIds.reduce(function (ac, id) {
                    var _a;
                    return (__assign(__assign({}, ac), (_a = {}, _a[id] = collectionState.byId[id], _a)));
                }, {}),
                allIds: allIds
            });
        });
    });
};
