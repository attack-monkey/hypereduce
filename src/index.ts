import {
  Action,
  connect as connectHR,
  disconnect as disconnectHR,
  dispatch as dispatchHR,
  getReducer as getReducerHR,
  getStore as getStoreHR,
  goto as gotoHR,
  hypeReduce as hypeReduceHR,
  hypeReduceCore as hypeReduceCoreHR,
  returnRouteObject as returnRouteObjectHR
} from './fns/hype-reduce.fn'

import { ROUTE_CHANGE as ROUTE_CHANGEHR } from './reducers/route_change/route_change.red'

import { REPLACE as REPLACEHR } from './reducers/any-reducers/replace.red'

import { DELETE as DELETEHR } from './reducers/collection-reducers/delete/delete.red'
import { SET as SETHR } from './reducers/collection-reducers/set/set.red'
import { UPDATE as UPDATEHR } from './reducers/collection-reducers/update/update.red'

// core library
export const connect = connectHR
export const disconnect = disconnectHR
export const dispatch = dispatchHR
export const getStore = getStoreHR
export const getRoute = returnRouteObjectHR
export const goto = gotoHR
export const hypeReduce = hypeReduceHR
export const getReducer = getReducerHR
export const hypeReduceCore = hypeReduceCoreHR

// common action-function / reducers
export const ROUTE_CHANGE = ROUTE_CHANGEHR

// any node action-functions
export const REPLACE = REPLACEHR

// collection action-functions
export const DELETE = DELETEHR
export const SET = SETHR
export const UPDATE = UPDATEHR
