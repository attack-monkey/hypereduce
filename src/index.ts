import {
  Action,
  connect as connectHR,
  dispatch as dispatchHR,
  getStore as getStoreHR,
  goto as gotoHR,
  hypeReduce as hypeReduceHR,
  hypeReduceCore as hypeReduceCoreHR
} from './fns/hype-reduce.fn'

export const connect = connectHR
export const dispatch = dispatchHR
export const getStore = getStoreHR
export const goto = gotoHR
export const hypeReduce = hypeReduceHR
export const hypeReduceCore = hypeReduceCoreHR
