"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hype_reduce_fn_1 = require("./fns/hype-reduce.fn");
var route_change_red_1 = require("./reducers/route_change/route_change.red");
var replace_red_1 = require("./reducers/any-reducers/replace.red");
var delete_red_1 = require("./reducers/collection-reducers/delete/delete.red");
var set_red_1 = require("./reducers/collection-reducers/set/set.red");
var update_red_1 = require("./reducers/collection-reducers/update/update.red");
// core library
exports.connect = hype_reduce_fn_1.connect;
exports.disconnect = hype_reduce_fn_1.disconnect;
exports.dispatch = hype_reduce_fn_1.dispatch;
exports.getStore = hype_reduce_fn_1.getStore;
exports.getRoute = hype_reduce_fn_1.returnRouteObject;
exports.goto = hype_reduce_fn_1.goto;
exports.hypeReduce = hype_reduce_fn_1.hypeReduce;
exports.getReducer = hype_reduce_fn_1.getReducer;
exports.hypeReduceCore = hype_reduce_fn_1.hypeReduceCore;
exports.getConnectionsStore = hype_reduce_fn_1.getConnectionsStore;
// common action-function / reducers
exports.ROUTE_CHANGE = route_change_red_1.ROUTE_CHANGE;
// any node action-functions
exports.REPLACE = replace_red_1.REPLACE;
// collection action-functions
exports.DELETE = delete_red_1.DELETE;
exports.SET = set_red_1.SET;
exports.UPDATE = update_red_1.UPDATE;
