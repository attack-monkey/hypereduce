/**
 * A group of functions responsible for managing application state
 */

import { display } from './display.fn'
import { exists } from './exists.fn'
import { keys } from './keys.fn'

// -- models --

interface Action {
  type: string
  payload?: any
}

interface Obj { [k: string]: any }

export type DStateNode<T> = (state: T, action: Action | undefined) => T

// -- mutables --

let id = 0 // id for subscriptions
let appState: any // the held application state
let dynamicStateStore: any // the held dynamic state object
const dynamicStateSubscriptions = {} // subscriptions for full state
const connectionsStore = {} // key / val store of connectors and their state at the given connector node
const connectionsSubscriptions = {} // 1:1 subscriptions from a node in the state to a registered connector

// -- getting full state --

export const fromDynamicState = (fn: <S>(state: S) => any) => fn(appState)

export const dynamicState = {
  subscribe: (fn: <S>(state: S) => any) => {
    dynamicStateSubscriptions[id] = fn
    id++
    return id - 1
  },
  unsubscribe: (key: number) => delete dynamicStateSubscriptions[key]
}

const emitToStateSubscriptions = <S>(state: S) =>
  keys(dynamicStateSubscriptions)
    .forEach(sub => dynamicStateSubscriptions[sub](state))

// -- managing connections

export const getConnections = (key: string) => connectionsStore[key]

export const connect = <S>(key: string, fn: (s: S) => any) => {
  connectionsSubscriptions[key]
    ? display(`Connections must be unique ${key} has already been registered`)
    : connectionsSubscriptions[key] = fn
}

export const connectAndEmitCurrent = <S>(key: string, fn: (s: S) => any) => {
  connectionsSubscriptions[key]
    ? display(`Connections must be unique ${key} has already been registered`)
    : (() => {
      connectionsSubscriptions[key] = fn
      connectionsSubscriptions[key](connectionsStore[key])
    })()
}

export const disconnect = (key: string) => {
  delete connectionsStore[key]
  delete connectionsSubscriptions[key]
  return true
}

const emitToConnections = <S>(connects: string[], state: S) => {
  (connects || []) // For any connects annotations...
  .forEach(
    connector => {
      connectionsStore[connector] = state // save the result to the key / val store
      setTimeout(() =>
        connectionsSubscriptions[connector]
          && typeof connectionsSubscriptions[connector] === 'function'
            ? connectionsSubscriptions[connector](state) // emit to the subscriptions
            : undefined
        , 0
      )
    }
  )
  return true
}

// -- core --

export type ReducerFn<T> = (state: T, action: Action) => T

export interface DNode<T> {
  init?: T
  connects?: string[]
  _?: T
  actions?: { [key: string]: ReducerFn<T> }
}

export const d = <T>(node: DNode<T>) => (state: T, action: Action | undefined) => {
  const { init, connects, _, actions } = node
  const actionKeys: string[] = keys(actions || {})
  const res =
    action?.type && exists(state) && actionKeys.includes(action.type)
      ? ((actions || {})[action.type] as ReducerFn<T>)(state, action) // action.type matches - fire the function!!
      : actionKeys.includes('$') && action
        ? (actions || {}).$(state, action) // $ wild card detected - fire the function
        : exists(_) && action
          ? rootReduce(state, action)(_) // _ = passdown
          : exists(state)
            ? state // else return state (if it exists)
            : init || undefined // else the initial value
  emitToConnections((connects || []), res)
  // console.log(`action ${action?.type}, state ${pretty(state)} ${exists(state)}, res ${pretty(res)}`)
  return res
}

const rootReduce = <S, D>(state: S, action: Action | undefined) => (input: D): S =>
  typeof input === 'object' && Array.isArray(input)
    ? input.map((item, i) => rootReduce(state && (state as any)[i], action)(item))
    : typeof input === 'object'
      ? keys(input as Record<string, unknown>)
        .reduce((ac, key) => ({ ...ac, [key]: rootReduce(state && (state as any)[key], action)(input[key])}), {})
      : typeof input === 'function'
        ? input(state, action)
        : input

// -- state managers --

export const manageState = <D>(input: D) => {
  appState = rootReduce(undefined as unknown, undefined)(input)
  dynamicStateStore = input
  return true
}

export const dispatch = (action: Action) => {
  appState = rootReduce(appState, action)(dynamicStateStore)
  emitToStateSubscriptions(appState)
  return true
}

export const dispatchAction = dispatch // alias
