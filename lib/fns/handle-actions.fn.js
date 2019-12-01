"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apply_fn_1 = require("./apply.fn");
var keys_fn_1 = require("./keys.fn");
var handleActionsI = function (action, state, fns, i) {
    return apply_fn_1.apply(keys_fn_1.keys(fns).length - 1, function (lastIndex) {
        return apply_fn_1.apply(keys_fn_1.keys(fns)[i], function (key) {
            return apply_fn_1.apply(lastIndex === i, function (isLastIndex) {
                return key === '_' // -> pass through
                    ? fns[key](state, action)
                    : action.type === key
                        ? fns[key](state, action)
                        : !isLastIndex
                            ? handleActionsI(action, state, fns, i + 1)
                            : state;
            });
        });
    });
};
exports.handleActions = function (state, action) {
    return function (fns) {
        return handleActionsI(action, state, fns, 0);
    };
};
