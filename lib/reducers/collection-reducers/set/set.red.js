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
exports.SET = function (collectionState, action) {
    return apply_fn_1.apply(action, function (setAction) {
        var _a;
        return setAction.collection === collectionState.collection
            ? ({
                collection: collectionState.collection,
                byId: __assign(__assign({}, collectionState.byId), (_a = {}, _a[setAction.id] = setAction.payload, _a)),
                allIds: collectionState.allIds
            })
            : collectionState;
    });
};
