import {
  Action,
  connect as connectHR,
  dispatch as dispatchHR,
  getStore as getStoreHR,
  goto as gotoHR,
  hypeReduce as hypeReduceHR,
  hypeReduceCore as hypeReduceCoreHR
} from './fns/hype-reduce.fn'

import { REPLACE as REPLACEHR } from './reducers/any-reducers/replace.red'

import { DELETE as DELETEHR} from './reducers/collection-reducers/delete/delete.red'
import { SET as SETHR} from './reducers/collection-reducers/set/set.red'
import { UPDATE as UPDATEHR} from './reducers/collection-reducers/update/update.red'

// core library
export const connect = connectHR
export const dispatch = dispatchHR
export const getStore = getStoreHR
export const goto = gotoHR
export const hypeReduce = hypeReduceHR
export const hypeReduceCore = hypeReduceCoreHR

// common action-function / reducers

// any node action-functions
export const REPLACE = REPLACEHR

// collection action-functions
export const DELETE = DELETEHR
export const SET = SETHR
export const UPDATE = UPDATEHR
